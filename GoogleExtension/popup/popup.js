document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['lastAnalysis'], (result) => {
    updateUI(result.lastAnalysis || {
      status: 'waiting',
      message: 'Open an email in Gmail to analyze'
    });
  });
});

function updateUI(data) {
  const resultDiv = document.getElementById('result');
  const confidenceDiv = document.getElementById('confidence');
  
  if (!data || data.status === 'waiting') {
    resultDiv.innerHTML = `
      <p>${data?.message || 'Open an email in Gmail'}</p>
      <small>If this persists, refresh Gmail and try again</small>
    `;
    resultDiv.style.color = '#666';
    confidenceDiv.textContent = '';
  } else if (data.error) {
    resultDiv.textContent = `⚠️ ${data.error}`;
    resultDiv.style.color = 'orange';
    confidenceDiv.textContent = '';
  } else if (data.is_phishing) {
    resultDiv.textContent = "⚠️ PHISHING DETECTED";
    resultDiv.style.color = 'red';
    confidenceDiv.textContent = `Confidence: ${(data.confidence )}%`;
  } else {
    resultDiv.textContent = "✓ Legitimate Email";
    resultDiv.style.color = 'green';
    confidenceDiv.textContent = `Confidence: ${(data.confidence )}%`;
  }
}