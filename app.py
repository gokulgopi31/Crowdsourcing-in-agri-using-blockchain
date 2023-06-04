from flask import Flask,request
from moralis import evm_api
from flask_cors import CORS
import json
from model import predictMNV

api_key = "S8NS7yBXbqQNQDyteiZ2BYDE3NxJZIWMvU1H3vethGFjeA1x9vnKwuhimyFW7t05"
id = 0
def model():
    pass
app = Flask(__name__)
CORS(app)

@app.route('/uploadImage',methods=['GET','POST'])
def uploadImage():
    data = json.loads(request.data.decode())
    body = [{"path": "moralis/post.jpg", "content": data['image'] }]
    result = evm_api.ipfs.upload_folder(api_key=api_key,body=body)
    print(result)
    return result


@app.route('/predict',methods=['POST'])
def predict():
    data = json.loads(request.data.decode())
    # print(data['image'].split(",")[1])
    image_base64 = data['image'].split(",")[1]
    response = predictMNV(image_base64)
    print(response.split(" ")[1])
    return response.split(" ")[1]

if __name__ == '__main__':
    app.run()