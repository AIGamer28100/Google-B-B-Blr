let targetNodeCount = null;
let targetNode;
let cronTask; // Store the interval ID

// Check if we are on a Discord page (add your Discord page check here)
if (window.location.hostname === "discord.com") { // Example check

    setTimeout(() => {
        cronTask = setInterval(() => {
            targetNode = document.querySelectorAll('[aria-roledescription="Message"]');

            if (targetNode && targetNodeCount === null) {
                console.log("Getting init length : " + targetNode.length);
                targetNodeCount = targetNode.length;
            } else if (targetNode && targetNodeCount < targetNode.length) { // Corrected condition
                console.log("New Messages Detected. Reading Data");
                console.log(`${targetNodeCount} < ${targetNode.length} `)
                try{
                    read_data();
                } catch (e) {
                    console.log(e)
                }
                targetNodeCount = targetNode.length;
            } else if (targetNode && targetNodeCount > targetNode.length) {
                console.log("Messages Deleted");
                targetNodeCount = targetNode.length;
            }
        }, 10);
    }, 5000);

    // Example: To stop the interval after a certain time (optional)
    // setTimeout(() => {
    //     clearInterval(cronTask);
    //     console.log("Interval stopped");
    // }, 60000); // Stop after 60 seconds
} else {
    console.log("Not on a Discord page. Script will not run.");
    // Optionally, you could add code to check for the Discord page periodically
    // and start the interval when it becomes available.
}

async function read_data() {
    let messages = []
    let messageTexts = ""
    let message_details = []
    if (window.location.hostname.includes("discord.com")) {
        console.log("Discord page detected");

        // Get the chat messages (this assumes a very basic structure and might need adjustments based on actual Discord HTML structure)
        messages = document.querySelectorAll('[aria-roledescription="Message"]')

        // Extract message text from each message
        messageTexts = Array.from(messages).map((message) => {
            username = null;
            timestamp = null;
            message_content = null;
            message_ui = null;

            username_html = message.querySelector('span[class^="username"]');
            timestamp_html = message.querySelector('time');
            message_content_html = message.querySelector('div[id^="message-content"]');
            message_ui_html = message.querySelector('div[id^="message-accessories"]');
            // console.log(message)
            // console.log(username_html)
            // console.log(timestamp_html)
            // console.log(message_content_html)
            // console.log(message_ui_html)
            // console.log()

            if (username_html !== null) {
                username = username_html.innerText;

            } else {
                console.log("Username not found in message");
                if (message_details.length > 0) {
                    console.log
                    username = message_details[message_details.length - 1].username;
                }
            }
            if (timestamp_html !== null) {
                timestamp = timestamp_html.dateTime;
            }
            if (message_content_html !== null) {
                message_content = message_content_html.innerText;
            }
            if (message_ui_html !== null) {
                message_ui = message_ui_html.outerHTML;
            }

            let details = {
                "username": username,
                "timestamp": timestamp,
                "message_content": message_content,
                "message_ui": message_ui,
            }

            message_details.push(details);

            // console.log(message)
            return message.outerHTML;
        });

        console.log("Messages in this channel:", message_details);

        const aiResponse = await processMessage(message_details);

        console.log(aiResponse)

        if (aiResponse) {
            // Display the toast with AI response, thumbs up/down buttons
            displayToast(aiResponse.response);
        }

        // After receiving AI response
        sessionStorage.setItem("historyData", JSON.stringify(aiResponse))
    }
}


function displayToast(message) {
    // ... (Your toast component logic here)
    console.log(message)
    if (message['is_task']) {
        task = message['response'][0];
        add_task = confirm(
            `Task Detected: ${task['task_title']}\n\nDescription: ${task['description']}\n\nAssignee: ${task['assignee']}\n\nStart Date: ${task['start_time']}\n\nEnd Date: ${task['end_time']}\n\nDo you want to add this task?`
        )

        if 
    }
}


async function processMessage(messageData) {
    try {
        const response = await fetch('http://127.0.0.1:8080/process', { // Replace with your HTTPS URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: messageData,
                historyData: sessionStorage.getItem("historyData")
            })
        });

        const responseData = await response.json();

        return responseData;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// setInterval(() => {
//     read_data();
// }, 5000);


/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
// async function uploadToGemini(path, mimeType) {
//     const uploadResult = await fileManager.uploadFile(path, {
//         mimeType,
//         displayName: path,
//     });
//     const file = uploadResult.file;
//     console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
//     return file;
// }

// const model = genAI.getGenerativeModel({
//     model: "gemini-2.0-flash-exp",
//     systemInstruction: "convert conversations into task if applicable using the below format:\n\nif the message is not a task : \n\n```json\n{\n  \"is_task\": false\n}\n```\n\nif the message is a task: \n\n```json\n{\n  \"istask\": true,\n  \"response\": {\n    \"title\" : \"<simple title>\"\n    \"description\": \"<detailed description>\",\n    \"startDate\": \"<now>\",\n    \"endDate\": \"<unset>,\n    \"assignee\" : \"<self>\",\n     \"created_by\": \"<self>\",\n  }\n}\n```\n",
// });

// const generationConfig = {
//     temperature: 1,
//     topP: 0.95,
//     topK: 40,
//     maxOutputTokens: 8192,
//     responseMimeType: "application/json",
//     responseSchema: {
//         type: "object",
//         properties: {
//             response: {
//                 type: "array",
//                 items: {
//                     type: "object",
//                     properties: {
//                         task_title: {
//                             type: "string"
//                         },
//                         description: {
//                             type: "string"
//                         },
//                         start_time: {
//                             type: "string"
//                         },
//                         end_time: {
//                             type: "string"
//                         },
//                         assignee: {
//                             type: "string"
//                         },
//                         created_by: {
//                             type: "string"
//                         }
//                     },
//                     required: [
//                         "start_time",
//                         "end_time",
//                         "assignee",
//                         "created_by"
//                     ]
//                 }
//             },
//             is_task: {
//                 type: "boolean"
//             }
//         },
//         required: [
//             "is_task"
//         ]
//     },
// };

// async function run() {
//     // TODO Make these files available on the local file system
//     // You may need to update the file paths
//     const files = [
//         await uploadToGemini("Unknown File", "application/octet-stream"),
//         await uploadToGemini("Unknown File", "application/octet-stream"),
//         await uploadToGemini("Unknown File", "application/octet-stream"),
//         await uploadToGemini("Unknown File", "application/octet-stream"),
//         await uploadToGemini("Unknown File", "application/octet-stream"),
//         await uploadToGemini("Unknown File", "application/octet-stream"),
//         await uploadToGemini("Unknown File", "application/octet-stream"),
//         await uploadToGemini("Unknown File", "application/octet-stream"),
//     ];

//     const chatSession = model.startChat({
//         generationConfig,
//         history: [
//             {
//                 role: "user",
//                 parts: [
//                     { text: "Hari sent : michle update jira board by the weekend" },
//                 ],
//             },
//             {
//                 role: "model",
//                 parts: [
//                     { text: "```json\n{\n  \"is_task\": true,\n  \"response\": {\n    \"assignee\": \"michle\",\n    \"created_by\": \"hari\",\n    \"end_time\": \"weekend\",\n    \"start_time\": \"now\",\n    \"description\": \"update jira board\",\n    \"task_title\": \"update jira board\"\n  }\n}" },
//                     {
//                         fileData: {
//                             mimeType: files[0].mimeType,
//                             fileUri: files[0].uri,
//                         },
//                     },
//                 ],
//             },
//             {
//                 role: "user",
//                 parts: [
//                     { text: "Hello world" },
//                 ],
//             },
//             {
//                 role: "model",
//                 parts: [
//                     { text: "```json\n{\n  \"is_task\": false\n}" },
//                     {
//                         fileData: {
//                             mimeType: files[1].mimeType,
//                             fileUri: files[1].uri,
//                         },
//                     },
//                 ],
//             },
//             {
//                 role: "user",
//                 parts: [
//                     { text: "Ash sent: Im doing good, how about you" },
//                 ],
//             },
//             {
//                 role: "model",
//                 parts: [
//                     { text: "```json\n{\n  \"is_task\": false\n}" },
//                     {
//                         fileData: {
//                             mimeType: files[2].mimeType,
//                             fileUri: files[2].uri,
//                         },
//                     },
//                 ],
//             },
//             {
//                 role: "user",
//                 parts: [
//                     { text: "Ash sent: Assign task to hari to add example of key value pair for model fine tuning by tonight" },
//                 ],
//             },
//             {
//                 role: "model",
//                 parts: [
//                     { text: "```json\n{\n  \"is_task\": true,\n  \"response\": {\n    \"assignee\": \"hari\",\n    \"created_by\": \"ash\",\n    \"end_time\": \"tonight\",\n    \"start_time\": \"now\",\n    \"description\": \"add example of key value pair for model fine tuning\",\n    \"task_title\": \"add example of key value pair for model fine tuning\"\n  }\n}" },
//                     {
//                         fileData: {
//                             mimeType: files[3].mimeType,
//                             fileUri: files[3].uri,
//                         },
//                     },
//                 ],
//             },
//             {
//                 role: "user",
//                 parts: [
//                     { text: "Karthik sent: Create a new feature to allow users to filter by category." },
//                 ],
//             },
//             {
//                 role: "model",
//                 parts: [
//                     { text: "```json\n{\n  \"is_task\": true,\n  \"response\": {\n    \"assignee\": \"self\",\n    \"created_by\": \"karthik\",\n    \"end_time\": \"unset\",\n    \"start_time\": \"now\",\n    \"description\": \"Create a new feature to allow users to filter by category.\",\n    \"task_title\": \"Create filter by category feature\"\n  }\n}" },
//                     {
//                         fileData: {
//                             mimeType: files[4].mimeType,
//                             fileUri: files[4].uri,
//                         },
//                     },
//                 ],
//             },
//             {
//                 role: "user",
//                 parts: [
//                     { text: "\"1734001016.416219 : <self> sent: Can you please review the design mockups?\",\n\"1734001018.416479 : Ash sent: Im on leave from tomorrow, will not be able to work on any task\",\n\"1734001020.416764 : Hari sent : Im out of station till next month. Hence on leave from work.\"" },
//                 ],
//             },
//             {
//                 role: "model",
//                 parts: [
//                     { text: "```json\n{\n  \"is_task\": true,\n  \"response\": {\n    \"assignee\": \"self\",\n    \"created_by\": \"self\",\n    \"end_time\": \"unset\",\n    \"start_time\": \"now\",\n    \"description\": \"review the design mockups\",\n    \"task_title\": \"review design mockups\"\n  }\n}" },
//                     {
//                         fileData: {
//                             mimeType: files[5].mimeType,
//                             fileUri: files[5].uri,
//                         },
//                     },
//                 ],
//             },
//             {
//                 role: "user",
//                 parts: [
//                     { text: "\"1734001018.416479 : Ash sent: Im on leave from tomorrow, will not be able to work on any task\",\n\"1734001020.416764 : Hari sent : Im out of station till next month. Hence on leave from work.\",\n\"1734001016.416219 : <self> sent: Can you please review the design mockups?\",\n\"1734001014.416042 : <self> sent: Let's schedule a meeting to discuss the project plan.\"," },
//                 ],
//             },
//             {
//                 role: "model",
//                 parts: [
//                     { text: "```json\n{\n  \"is_task\": true,\n  \"response\": [\n    {\n      \"assignee\": \"self\",\n      \"created_by\": \"self\",\n      \"end_time\": \"unset\",\n      \"start_time\": \"now\",\n      \"description\": \"review the design mockups\",\n      \"task_title\": \"review design mockups\"\n    },\n    {\n       \"assignee\": \"all\",\n      \"created_by\": \"self\",\n      \"end_time\": \"unset\",\n      \"start_time\": \"now\",\n      \"description\": \"schedule a meeting to discuss the project plan\",\n      \"task_title\": \"schedule project plan meeting\"\n    }\n  ]\n}" },
//                     {
//                         fileData: {
//                             mimeType: files[6].mimeType,
//                             fileUri: files[6].uri,
//                         },
//                     },
//                 ],
//             },
//             {
//                 role: "user",
//                 parts: [
//                     { text: "\"1734000988.412799 : Siva sent : Someone Update on DC stats\"," },
//                 ],
//             },
//             {
//                 role: "model",
//                 parts: [
//                     { text: "```json\n{\n  \"is_task\": true,\n  \"response\":  [\n     {\n    \"assignee\": \"open\",\n    \"created_by\": \"siva\",\n    \"end_time\": \"unset\",\n    \"start_time\": \"now\",\n    \"description\": \"update on dc stats\",\n    \"task_title\": \"update on dc stats\"\n    }\n    ]\n}" },
//                     {
//                         fileData: {
//                             mimeType: files[7].mimeType,
//                             fileUri: files[7].uri,
//                         },
//                     },
//                 ],
//             },
//         ],
//     });

//     const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
//     console.log(result.response.text());
// }

// run();