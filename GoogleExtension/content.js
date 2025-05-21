// === Extract the currently opened Gmail email content ===
function extractGmailContent() {
  const emailBody = document.querySelector(".a3s.aiL");
  return emailBody ? emailBody.innerText.trim() : "";
}

// === Create and show the floating popup ===
function showPopup(result) {
  // Remove any existing popup to avoid duplicates
  const existingPopup = document.getElementById("phishing-popup");
  if (existingPopup) existingPopup.remove();

  const popup = document.createElement("div");
  popup.id = "phishing-popup";
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    color: #333;
    padding: 18px 20px;
    border-radius: 14px;
    font-family: 'Segoe UI', sans-serif;
    font-size: 15px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    border-left: 6px solid ${result.is_phishing ? "#e74c3c" : "#2ecc71"};
    z-index: 99999;
    width: 320px;
    transition: all 0.3s ease;
  `;

  // Create popup content
  popup.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 10px;">
      <img 
        src="${chrome.runtime.getURL(result.is_phishing ? 'icons/alert.png' : 'icons/check.png')}" 
        width="28" 
        style="margin-right: 12px;" 
      />
      <div>
        <strong style="font-size: 16px;">
          ${result.is_phishing ? "Phishing Alert" : "Legitimate Email"}
        </strong><br/>
        <span style="font-size: 13px;">
          Confidence: ${Math.round(result.confidence)}%
        </span>
      </div>
    </div>
    <div style="text-align: right;">
      <button id="dismiss-btn" style="
        background: #f0f0f0;
        color: #333;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
      ">Dismiss</button>
    </div>
  `;

  popup.querySelector("#dismiss-btn").onclick = () => popup.remove();
  document.body.appendChild(popup);
}

// === Listen for analysis result from background script ===
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "analysisResult" && message.data) {
    console.log("[CS] Received result from background:", message.data);
    showPopup(message.data);
  }
});

// === Send email content to background for analysis ===
function sendEmailContent() {
  const content = extractGmailContent();
  if (content && content.length > 50) {
    chrome.runtime.sendMessage({
      type: "emailContent",
      content,
      url: window.location.href
    });
  }
}

// === Handle initial analysis on email load ===
setTimeout(sendEmailContent, 3000);

// === Detect Gmail navigation (SPA) to re-trigger analysis ===
let currentUrl = location.href;

const observer = new MutationObserver(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;

    // Remove existing popup on navigation
    const popup = document.getElementById("phishing-popup");
    if (popup) popup.remove();

    // Trigger new analysis if an email is opened
    if (currentUrl.includes("#inbox/") || currentUrl.includes("#sent/")) {
      setTimeout(sendEmailContent, 3000);
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
