import re

NORMAL_RANGES = {
    "hemoglobin": (13, 17, "g/dL"),
    "rbc": (4.5, 5.9, "million/uL"),
    "wbc": (4000, 11000, "cells/uL"),
    "platelets": (150000, 450000, "cells/uL"),
}

def parse_blood_report(text: str) -> dict:
    text = text.lower()
    results = {}

    def find_value(pattern):
        match = re.search(pattern, text)
        return float(match.group(1)) if match else None

    values = {
        "hemoglobin": find_value(r"hemoglobin\s*[:\-]?\s*(\d+\.?\d*)"),
        "rbc": find_value(r"rbc\s*[:\-]?\s*(\d+\.?\d*)"),
        "wbc": find_value(r"wbc\s*[:\-]?\s*(\d+\.?\d*)"),
        "platelets": find_value(r"platelet[s]?\s*[:\-]?\s*(\d+)"),
    }

    for key, value in values.items():
        if value is None:
            continue

        low, high, unit = NORMAL_RANGES[key]
        status = "normal" if low <= value <= high else "high" if value > high else "low"

        results[key] = {
            "value": value,
            "min": low,
            "max": high,
            "unit": unit,
            "status": status,
        }

    return results
