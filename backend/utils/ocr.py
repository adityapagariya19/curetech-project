from google.cloud import vision
import io
import os

# Path relative to backend/
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "credentials/google_vision.json"

def extract_text(file_path: str) -> str:
    client = vision.ImageAnnotatorClient()

    with io.open(file_path, "rb") as f:
        content = f.read()

    image = vision.Image(content=content)
    response = client.text_detection(image=image)

    if response.error.message:
        raise Exception(response.error.message)

    return response.text_annotations[0].description if response.text_annotations else ""
