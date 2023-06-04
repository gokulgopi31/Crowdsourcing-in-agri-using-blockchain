import numpy as np
from PIL import Image,ImageOps
import matplotlib.pyplot as plt
from keras.models import load_model
from io import BytesIO
import base64

@staticmethod
def predictMNV(img):
    model = load_model("Model.h5")
    class_names = open("labels.txt","r").readlines()

    data = np.ndarray(shape=(1,224,224,3),dtype=np.float32)
    image = Image.open(BytesIO(base64.b64decode(img)))
    image = image.convert("RGB")
    image = ImageOps.fit(image,(224,224))
    image_array = np.asarray(image)
    normalized_image_array = (image_array.astype(np.float32)/127.5)-1
    data[0] = normalized_image_array 
    prediction = model.predict(data)
    index = np.argmax(prediction)
    return class_names[index]