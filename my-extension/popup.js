// Get the message list element
const messageList = document.getElementById("messageList");

// Listen for messages sent from content.js
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'DISCORD_MESSAGES') {
    const messages = message.messages;
    messageList.innerHTML = ""; // Clear the list first

    // Display each message in the list
    messages.forEach((msg) => {
      const li = document.createElement("li");
      li.textContent = msg;
      messageList.appendChild(li);
    });
  }
});
