from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from models import check_emails  # Your custom function

app = Flask(__name__)

# CORS configuration to allow requests from your Chrome extension
CORS(app, origins=["chrome-extension://enenkgnhcdonibejkfdnaopkdflfhmmg"])

@app.route('/predict', methods=['POST'])
@cross_origin(origins=["chrome-extension://enenkgnhcdonibejkfdnaopkdflfhmmg"])
def predict():
    data = request.json
    email_content = data.get('email')

    # Check email and get prediction
    prediction = check_emails(email_content)
    probability = max(prediction['legitimate_score'], prediction['spam_score'])

    print("prediction is", prediction)
    return jsonify({
        'is_phishing': bool(prediction['is_spam']),
        'confidence': float(probability)
    })

if __name__ == '__main__':
    # Run on all interfaces so the extension can access it
    app.run(host='0.0.0.0', port=5000, debug=True)
