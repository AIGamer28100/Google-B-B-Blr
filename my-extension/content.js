// Check if we are on a Discord page

window.onload()

function read_data() {
    if (window.location.hostname.includes("discord.com")) {
        console.log("Discord page detected");

        // Get the chat messages (this assumes a very basic structure and might need adjustments based on actual Discord HTML structure)
        const messages = document.querySelectorAll('[aria-roledescription="Message"]')

        // Extract message text from each message
        const messageTexts = Array.from(messages).map((message) => {
            return message.innerText;
        });

        console.log("Messages in this channel:", messageTexts);

        // Send the extracted messages to the background script or display them on the popup
        chrome.runtime.sendMessage({
            type: 'DISCORD_MESSAGES',
            messages: messageTexts
        });
    }

}