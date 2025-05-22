import React, { useState } from 'react';
import axios from 'axios';
import './emailChecker.css';

function EmailChecker() {
  const [emailText, setEmailText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [error, setError] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);

  const handleSubmit = async (e) => {
    console.log("dd")
    e.preventDefault();
    if (!emailText.trim()) {
      setError('Veuillez entrer un texte à analyser');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setHasResult(false);

    try {
      const response = await axios.post('/api/verifier_email', { email: emailText });
       // 2. Vérification complète de la réponse
       console.log('Réponse complète:', response);
      if (!response.data || typeof response.data.is_spam === 'undefined') {
        throw new Error('Réponse du serveur invalide');
      }
    


      const newResult = {

        verdict: response.data.is_spam,
        
        spamScore: response.data.spam_score || 0,
        legitimateScore: response.data.legitimate_score || 0,
        
      };
     
      
      setResult(newResult);
      setHasResult(true);
      setAnalysisHistory(prev => [
        { 
          email: emailText, 
          result: {
            verdict: newResult.verdict,
            label: newResult.verdict ? 'SPAM' : 'LÉGITIME'
          },
          
          date: new Date().toLocaleString(),
          scores: {
            spam: newResult.spamScore,
            legitimate: newResult.legitimateScore
          }
        },
        ...prev.slice(0, 4)
      ]);
    } catch (err) {
      setError(err.response?.data?.error || 'Échec de l\'analyse de l\'email');
      console.error('Erreur API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setEmailText('');
    setResult(null);
    setHasResult(false);
    setError(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1><span className="logo-icon">🛡️</span>Email Spam Detector</h1>
          <p className="subtitle">One-click analysis for suspicious emails</p>
        </div>
      </header>

      <main className="app-main">
        <div className="analysis-container">
          <form onSubmit={handleSubmit} className="email-form">
            <div className="form-header">
              <h2>Start New Analysis</h2>
              {emailText && (
                <button type="button" onClick={clearAll} className="clear-button">
                  Delete
                </button>
              )}
            </div>
            
            <div className={`text-area-container ${result ? 'with-result' : ''}`}>
              <textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Paste the content of the suspicious email here..."
                rows={8}
                className="email-textarea"
                disabled={isLoading}
              />
              {hasResult && <div className="result-spacer"></div>}
              {hasResult && (
                <div className="result-display">
                  <div className={`result-badge ${result.verdict ? 'spam' : 'legitimate'}`}>
                     {result.verdict ? 'SPAM DETECTED' : 'LEGITIMATE EMAIL'}
                  </div>
                  <div className="score-display">
                    <div className="score-bar">
                      <div 
                        className="score-fill spam-score"
                        style={{ width: `${result.spamScore}%` }}
                      ></div>
                      <div 
                        className="score-fill legitimate-score"
                        style={{ width: `${result.legitimateScore}%` }}
                      ></div>
                    </div>
                    <div className="score-labels">
                      <span className="spam-label">{result.spamScore}% Spam</span>
                      <span className="legitimate-label">{result.legitimateScore}% legitimate</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="form-footer">
              <button 
                type="submit" 
                className={`analyze-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || !emailText.trim()}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Analysis in progress...
                  </>
                ) : (
                  'Analyser cet email'
                )}
              </button>
            </div>
          </form>
          {result && result.verdict && (
                <div className="advice-section">
                  <h3 className="advice-title">
                    <span className="advice-icon">⚠️</span>
                      Advices
                  </h3>
                  <div className="advice-content">
                    <p>📧 This email has been identified as potentially dangerous. Here are our recommendations to reslove it:</p>
                    <ul className="advice-list">
                      <li>Avoiding excessive links and suspicious attachments.</li>
                      <li>Writing with clear structure and intent.</li>
                      <li>Minimizing trigger words used in spam campaigns.</li>
                
                     </ul>
                  </div>
                  







                </div>
          )}


          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>

        {analysisHistory.length > 0 && (
          <div className="history-section">
            <h3 className="history-title">
              <span className="history-icon">🕒</span>
              Detection History
            </h3>
            <div className="history-list">
              {analysisHistory.map((item, index) => (
                <div key={index} className="history-item">
                  <div className="history-item-header">
                    <span className={`history-badge ${item.result.verdict ? 'spam' : 'legitimate'}`}>
                      {item.result.label}
                    </span>
                   

                    <span className="history-date">{item.date}</span>
                  </div>
                  <div className="history-scores">
                    <span className="score-badge spam">{item.scores.spam}%</span>
                    <span className="score-badge legitimate">{item.scores.legitimate}%</span>
                  </div>
                  <p className="history-text">{item.email.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Spam Detection – Security Utility</p>
      </footer>
    </div>
  );
}

export default EmailChecker;