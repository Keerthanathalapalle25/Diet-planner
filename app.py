from flask import Flask, render_template_string, request

app = Flask(__name__)
HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>Diet Planner Chatbot</title>
    <style>
        body {
            font-family: Arial;
            background: #e8f5e9;
            text-align: center;
            padding: 30px;
        }
        .box {
            background: white;
            max-width: 450px;
            margin: auto;
            padding: 25px;
            border-radius: 15px;
        }
        input, select, button {
            width: 90%;
            padding: 10px;
            margin: 8px;
        }
        button {
            background: #2e7d32;
            color: white;
            border: none;
            cursor: pointer;
        }
    </style>
</head>
<body>
<div class="box">
    <h1>🥗 Diet Planner</h1>
    <p>Get a simple daily diet suggestion!</p>
    <form method="POST">
        <input type="number" name="age" placeholder="Age" min="18" max="100" required>
        <input type="number" name="weight" placeholder="Weight (kg)" min="30" max="300" step="0.1" required>
        <input type="number" name="height" placeholder="Height (cm)" min="100" max="250" required>
        <select name="activity">
            <option>Low activity</option>
            <option>Moderate activity</option>
            <option>High activity</option>
        </select>
        <select name="goal">
            <option>Maintain weight</option>
            <option>Healthy weight loss</option>
            <option>Healthy weight gain</option>
        </select>
        <button type="submit">Create My Diet Plan</button>
    </form>
    {% if plan %}
        <h2>Your Daily Plan</h2>
        <p>{{ plan }}</p>
    {% endif %}
    <p><small>General nutrition information only, not medical advice.</small></p>
</div>
</body>
</html>
"""

@app.route("/", methods=["GET", "POST"])
def home():
    plan = ""
    if request.method == "POST":
        age = int(request.form["age"])
        weight = float(request.form["weight"])
        height = int(request.form["height"])
        activity = request.form["activity"]
        goal = request.form["goal"]

        if not (18 <= age <= 100 and 30 <= weight <= 300
                and 100 <= height <= 250):
            plan = "Please enter valid age, weight and height."
        else:
            plan = (
                "Breakfast: Oats or idli with eggs, milk or curd. "
                "Lunch: Rice or roti with dal, vegetables and curd. "
                "Snack: Fruit and a handful of nuts. "
                "Dinner: Roti or rice with vegetables and protein. "
                "Drink water regularly. "
                f"Your goal is {goal}; activity level: {activity}. "
                "Adjust portions to your needs."
            )

    return render_template_string(HTML, plan=plan)

if __name__ == "__main__":
    app.run(debug=True)