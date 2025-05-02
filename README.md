# ⚽ GoalSight: AI-Powered Soccer Match Predictor

**GoalSight** is a full-stack application that predicts the outcome of professional soccer matches (Win/Draw/Loss) using a neural network trained on historical match data. Built with **Python**, **FastAPI**, and **React**, this project provides an end-to-end solution for soccer match outcome prediction.

---

## 📊 Dataset

The dataset used for training the model is sourced from [football-data.co.uk](https://football-data.co.uk/). It includes historical English Premier League (EPL) match data with team statistics, match outcomes, and basic player performance metrics.

---

## 🧑‍🔧 Installation

Follow the steps below to run GoalSight locally.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sameerthapax/goalsight.git
cd goalsight
```

---

### 2️⃣ Backend Setup (FastAPI + PyTorch)

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

Run the FastAPI server:

```bash
cd backend
uvicorn main:app --reload
```

> The backend API will be available at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### 3️⃣ Frontend Setup (React + Tailwind CSS)

Open a **new terminal window**:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

> The frontend app will be running at: [http://localhost:5173](http://localhost:5173)

---

## 🚀 Features

* Train and evaluate a neural network to predict match outcomes
* REST API using FastAPI to serve predictions
* React frontend for user interaction
* Supports Win/Draw/Loss classification
* Input historical features and team stats
* Displays prediction probabilities and model confidence

---

## 🧠 Input Features

* Home Team
* Away Team
* Match Date
* Location (Home/Away/Neutral)

---

## 📤 Output

* Match prediction: **Win / Draw / Loss**
* Probabilities for each outcome (e.g., Home: 60%, Draw: 20%, Away: 20%)

---

## 🧱 Tech Stack

* **Backend**: FastAPI, PyTorch
* **Frontend**: React, JS
* **Data/Modeling**: scikit-learn, pandas, NumPy, PyTorch

---

## 📁 Project Structure

```
goalsight/
├── backend/       # FastAPI server and ML model API
├── frontend/      # React frontend with Tailwind styling
├── data/          # Match datasets (CSV format)
├── models/        # Trained neural network models
├── notebooks/     # Google Colab notebooks for training & visualization
├── src/           # Python scripts for training and preprocessing
├── requirements.txt
├── README.md
└── .gitignore
```

---

## 👥 Team

* **Project Manager**: Sameer Thapa ([sameerthapax](https://github.com/sameerthapax))
* **Contributor**: Aayush Agasti

---

## 🫂 Acknowledgements

* [Google Colab](https://colab.research.google.com/)
* [FastAPI](https://fastapi.tiangolo.com/)
* [React](https://reactjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [PyTorch](https://pytorch.org/)
* [scikit-learn](https://scikit-learn.org/)
* [pandas](https://pandas.pydata.org/)
* [NumPy](https://numpy.org/)
* [football-data.co.uk](https://football-data.co.uk/)
* [Matplotlib](https://matplotlib.org/)
* [Seaborn](https://seaborn.pydata.org/)

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
