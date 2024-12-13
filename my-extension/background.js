chrome.runtime.onInstalled.addListener(() => {
  console.log('Discord Reader Extension Installed');
});

// Listen for when the user clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked', tab);
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'storeHistory') {
    const history = JSON.parse(localStorage.getItem('aiHistory')) || [];
    history.push(request.data);
    localStorage.setItem('aiHistory', JSON.stringify(history));
  }
});