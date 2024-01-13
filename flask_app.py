from flask import Flask, render_template, request, jsonify
import base64
import io
from PIL import Image
import numpy as np
from keras.models import load_model


# import your model here

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    # Get the data URL from the request
    data_url = request.json["image"]

    # Remove header of data URL
    _, encoded = data_url.split(",", 1)

    # Decode the base64 data
    data = base64.b64decode(encoded)

    # Convert to image
    image = Image.open(io.BytesIO(data))

    # Resize the image

    image = image.convert('RGB')
    image = image.resize((128, 128))

    # Convert the resized image to a numpy array
    image = np.array(image)

    # Check the new shape of the image
    print(image.shape)

    # Reshape the image to match the input shape of the model
    reshaped_image = image.reshape(1, 128, 128, 3)

    model = load_model("emotion.h5")

    # Make predictions
    predictions = model.predict(reshaped_image)

    print(predictions)

    classes = ["Angry", "Happy", "Neutral", "Sad", "Surpeised"]

    emot = "Neutral"

    for i in predictions[0]:
        if i == 1:
            emot = classes[predictions[0].tolist().index(i)]
            break

    # Return the predicted emotion
    return jsonify({"emotion": emot})  # replace 'happy' with the predicted emotion

if __name__ == "__main__":
    app.run(debug=True)
