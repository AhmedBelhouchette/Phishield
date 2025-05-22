
from flask import Flask, request, jsonify
from flask_cors import CORS

from model import check_emails

app = Flask(__name__)
CORS(app)


# Exemple très simple (à remplacer par un vrai modèle de détection de spam)

@app.route('/api/verifier_email', methods=['POST', 'GET'])
def verifier_email():
    print("we are at flask")
    data = request.get_json()
    email = data['email']
 
    resultat =check_emails(email)# "Spam" ou "legitime"
    print(resultat)
  
    return jsonify({
            'is_spam': resultat['is_spam'],
            'spam_score': resultat['spam_score'] ,  # Conversion en pourcentage
            'legitimate_score': resultat['legitimate_score'] ,
            
        })

if __name__ == '__main__':
    print("🚀 Serveur Flask en cours de démarrage sur http://127.0.0.1:5000")
    app.run(debug=True,port=5000)




