import os
from fastapi import FastAPI
from pydantic import BaseModel
import torch
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# Load model architecture from separate file if needed
from model_architecture import GoalSightWithEmbeddings

BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH  = os.path.join(BASE_DIR, "..", "models", "goalsight_model.pt")
ENCODER_PATH = os.path.join(BASE_DIR,"..", "models", "team_encoder.pkl")

# ==== Load model and encoders ====
model = GoalSightWithEmbeddings(
    num_teams=46,  # Set this to your actual number of teams
    embedding_dim=32,
    input_dim=7,  # We have 7 numerical input features
    hidden_dim=64,
    output_dim=3
)
model.load_state_dict(
    torch.load(MODEL_PATH, map_location=torch.device('cpu')))
model.eval()

le_team = joblib.load(ENCODER_PATH)

# ==== FastAPI app ====
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MatchInput(BaseModel):
    home_team: str
    away_team: str
    month: int
    weekday: int
    year: int
    last_5_home_wins: int
    last_5_away_wins: int
    is_weekend: int
    is_first_half_season: int


@app.get("/")
def root():
    return {"message": "GoalSight backend is running!"}


@app.post("/predict")
def predict_match(data: MatchInput):
    try:
        home_encoded = le_team.transform([data.home_team])[0]
        away_encoded = le_team.transform([data.away_team])[0]
    except ValueError:
        return {"error": "Invalid team name provided. Make sure the team exists in the encoder."}

    X_team = torch.tensor([[home_encoded, away_encoded]], dtype=torch.long)
    X_other = torch.tensor([[data.month, data.weekday, data.year,
                             data.last_5_home_wins, data.last_5_away_wins,
                             data.is_weekend, data.is_first_half_season
                             ]], dtype=torch.float32)

    with torch.no_grad():
        output = model(X_team, X_other)
        probabilities = torch.softmax(output, dim=1).numpy()[0]
        pred_class = np.argmax(probabilities)

    outcomes = ['Away Win', 'Draw', 'Home Win']  # Based on label encoding order

    return {
        "prediction": outcomes[pred_class],
        "probabilities": {
            "Home Win": round(float(probabilities[2]), 4),
            "Draw": round(float(probabilities[1]), 4),
            "Away Win": round(float(probabilities[0]), 4)
        }
    }
