
import pickle
from scipy.sparse import csr_matrix


with open(r"C:\Users\hp\Documents\GitHub\phishing_checker\model.pkl", "rb") as f:#ahmed model
    model1= pickle.load(f)
with open(r"C:\Users\hp\Documents\GitHub\phishing_checker\vectorizer1.pkl", "rb") as f:# ahmed vectorizer
    vectorizer1 = pickle.load(f)


with open(r"C:\Users\hp\Documents\GitHub\phishing_checker\modellg.pkl", "rb") as f:
    modellg = pickle.load(f)
with open(r"C:\Users\hp\Documents\GitHub\phishing_checker\modelnb.pkl", "rb") as f:
    modelnb = pickle.load(f)
with open(r"C:\Users\hp\Documents\GitHub\phishing_checker\modelsgd.pkl", "rb") as f:
    modelsgd = pickle.load(f)
with open(r"C:\Users\hp\Documents\GitHub\phishing_checker\modelrnf.pkl", "rb") as f:
    modelrnf = pickle.load(f)


with open(r"C:\Users\hp\Documents\GitHub\phishing_checker\vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)


models_with_weights = {
    modelnb: 97.32,
    modellg: 97.95,
    modelsgd: 98.03,
    modelrnf: 97.83,
    model1: 96.6
}

def check_emails(email_text):
    vector = vectorizer.transform([email_text])
    vector1= vectorizer1.transform([email_text])#AHMED MODEL
    
    total_weighted_proba = 0
    total_weights = 0

    for model, weight in models_with_weights.items():
        if model==model1 :
            proba = model.predict_proba(vector1)#AHMED MODEL
        else: 
            proba = model.predict_proba(vector)
        spam_proba = proba[0][0]  # Classe 0 : spam
        total_weighted_proba += spam_proba * weight
        total_weights += weight

    final_score = total_weighted_proba / total_weights  # Score entre 0 et 1
    return {
    
        'spam_score': float(round(final_score * 100, 3)),
        'legitimate_score': float(round(100 - final_score * 100, 3)),
        'is_spam': bool(final_score > 0.5)
    }




print(check_emails("""Dear Students,

I hope this message finds you well. I am writing to share three fascinating PCD topics suggested by Pr. Lassaad Latrach. Please find the details below:

Sujet 1: Reconnaissance d'empreintes digitales endommagées à des fins judiciaires
La reconnaissance d'empreintes digitales est une technique courante dans les enquêtes judiciaires pour identifier des suspects. Cependant, les empreintes digitales peuvent être endommagées ou incomplètes, ce qui complique leur identification. Ce sujet explore l’utilisation de techniques de Deep Learning pour améliorer la précision de la reconnaissance des empreintes digitales même dans des conditions où elles sont partiellement effacées ou déformées. L’objectif est de fournir des outils plus robustes pour les enquêtes judiciaires, notamment dans le cadre de la résolution de crimes.

Sujet 2 : Détection de Fake News sur les réseaux sociaux à l'aide du Transfer Learning et du NLP
Les Fake News ont un impact majeur sur la perception publique et la prise de décision à travers les réseaux sociaux. L’utilisation du Transfer Learning et du NLP permet de créer des systèmes capables d'analyser le texte, les images et même le contexte des publications pour détecter de fausses informations. Le Transfer Learning permet de tirer parti des modèles linguistiques pré-existants pour entraîner des modèles spécifiques aux réseaux sociaux et détecter efficacement les Fake News, tout en améliorant les taux de précision dans la classification.

Sujet 3: Reconnaissance d'images falsifiées avec le Transfer Learning dans les procédures judiciaires
Avec l'augmentation de l'usage des outils de manipulation d'images, telles que les deepfakes, la reconnaissance d'images falsifiées devient essentielle pour les procédures judiciaires. Ce sujet se concentre sur l'utilisation du Transfer Learning pour identifier des images ou des vidéos manipulées à des fins de fraude ou de manipulation dans un contexte judiciaire. Grâce au Transfer Learning, il est possible d'exploiter des modèles d'images préformés pour adapter des systèmes capables de détecter des anomalies ou des falsifications dans des supports visuels. Ce processus contribue à garantir l'intégrité des preuves dans les enquêtes et les procès.

If you are interested in any of these topics, kindly fill out the following form: 

https://docs.google.com/forms/d/e/1FAIpQLSePx4SD5b7r8Lq4Q4IxPm0i9tXgZh7aDr9uFY4hqc6EOGSY-w/viewform"""))

