chrome.runtime.onInstalled.addListener(() => {
    console.log('Discord Reader Extension Installed');
  });
  
  // Listen for when the user clicks on the extension icon
  chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked', tab);
  });
  