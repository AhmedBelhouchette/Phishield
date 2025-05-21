let analysisCache = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "emailContent") {
    console.log("[BG] Email content received:", message.content.slice(0, 100));

    analyzeEmail(message.content)
      .then(result => {
        console.log("[BG] Sending result to content script:", result);

        analysisCache[message.url] = result;
        chrome.storage.local.set({ lastAnalysis: result });

        chrome.tabs.sendMessage(sender.tab.id, {
          type: "analysisResult",
          data: result
        });

        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon.png',
          title: result.is_phishing ? '⚠️ Phishing Detected' : '✓ Legitimate Email',
          message: `Confidence: ${Math.round(result.confidence)}%`,
          priority: 2
        });
      })
      .catch(err => {
        console.error("[BG] Analysis failed:", err);
      });

    return true; // keep message channel open for async response
  }
});

async function analyzeEmail(content) {
  try {
    const res = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: content })
    });
    return await res.json();
  } catch (err) {
    return { error: "Analysis service unavailable" };
  }
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get("lastAnalysis", (data) => {
    chrome.tabs.sendMessage(tab.id, {
      type: "analysisResult",
      data: data.lastAnalysis || { error: "No analysis available." }
    });
  });
});
