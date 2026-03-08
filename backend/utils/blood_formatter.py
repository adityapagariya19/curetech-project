def format_blood_for_ui(parsed: dict) -> dict:
    parameters = []
    score = 0

    for key, item in parsed.items():
        parameters.append({
            "id": key,
            "name": key.replace("_", " ").title(),
            "value": item["value"],
            "min": item["min"],
            "max": item["max"],
            "unit": item["unit"],
            "status": item["status"],
        })

        if item["status"] == "normal":
            score += 10

    score = min(score * 2, 100)

    return {
        "score": score,
        "parameters": parameters,
        "summary": "AI-generated medical interpretation based on extracted clinical values.",
        "health_domains": [
            {
                "domain": "Blood Health",
                "level": "Moderate",
                "home_care": [
                    "Maintain balanced diet",
                    "Stay hydrated",
                    "Exercise regularly",
                ],
                "doctor_advice": "Consult a physician if abnormal values persist."
            }
        ]
    }
