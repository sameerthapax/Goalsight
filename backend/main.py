from fastapi import FastAPI
from pydantic import BaseModel
import torch
import joblib
import numpy as np

# Load model architecture from separate file if needed
from model_architecture import GoalSightWithEmbeddings

# ==== Load model and encoders ====
model = GoalSightWithEmbeddings(
    num_teams=46,  # Set this to your actual number of teams
    embedding_dim=32,
    input_dim=7,  # We have 7 numerical input features
    hidden_dim=64,
    output_dim=3
)
model.load_state_dict(
    torch.load("/Users/sams/Desktop/Goalsight/models/goalsight_model.pt", map_location=torch.device('cpu')))
model.eval()

le_team = joblib.load("/Users/sams/Desktop/Goalsight/models/team_encoder.pkl")

# ==== FastAPI app ====
app = FastAPI()


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
