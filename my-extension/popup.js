// add a floating button in the bottom when clicked should run the `read_data` in content.js
const button = document.createElement('button');
button.textContent = 'Read Data';
button.style.position = 'fixed';
button.style.bottom = '10px';
button.style.right = '10px';
button.style.zIndex = '1000';
document.body.appendChild(button);

button.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'read_data' });
  });
});