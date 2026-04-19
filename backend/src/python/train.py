import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

data = pd.read_csv("fish_dataset.csv")

X = data.iloc[:, :-1]
y = data.iloc[:, -1]

model = RandomForestClassifier(n_estimators=100)
model.fit(X,y)

joblib.dump(model, "quality_model.pkl")

print("Model trained and saved.")