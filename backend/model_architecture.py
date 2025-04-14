import torch.nn as nn
import torch


class GoalSightWithEmbeddings(nn.Module):
    def __init__(self, num_teams, embedding_dim, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.home_embed = nn.Embedding(num_teams, embedding_dim)
        self.away_embed = nn.Embedding(num_teams, embedding_dim)

        self.fc = nn.Sequential(
            nn.Linear(embedding_dim * 2 + input_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_dim, output_dim)
        )

    def forward(self, x_teams, x_other):
        home_team = self.home_embed(x_teams[:, 0])
        away_team = self.away_embed(x_teams[:, 1])
        x = torch.cat([home_team, away_team, x_other], dim=1)
        return self.fc(x)
