const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const apiKey = process.env.GEMINI_API_KEY;  // AIzaSyCssYTZGKH4IIVClhgxCaXbJorQSElepRg
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

const model = genAI.getGenerativeModel({
  "model": "gemini-2.0-flash-exp",
  "systemInstruction": "convert conversations into task if applicable using the below format:\n\nif the message is not a task : \n\n```json\n{\n  \"is_task\": false\n}\n```\n\nif the message is a task: \n\n```json\n{\n  \"istask\": true,\n  \"response\": {\n    \"title\" : \"<simple title>\"\n    \"description\": \"<detailed description>\",\n    \"startDate\": \"<now>\",\n    \"endDate\": \"<unset>,\n    \"assignee\" : \"<self>\",\n     \"created_by\": \"<self>\",\n  }\n}\n```\n",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      response: {
        type: "array",
        items: {
          type: "object",
          properties: {
            task_title: {
              type: "string"
            },
            description: {
              type: "string"
            },
            start_time: {
              type: "string"
            },
            end_time: {
              type: "string"
            },
            assignee: {
              type: "string"
            },
            created_by: {
              type: "string"
            }
          },
          required: [
            "start_time",
            "end_time",
            "assignee",
            "created_by"
          ]
        }
      },
      is_task: {
        type: "boolean"
      }
    },
    required: [
      "is_task"
    ]
  },
};

async function run() {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [
    await uploadToGemini("Unknown File", "application/octet-stream"),
    await uploadToGemini("Unknown File", "application/octet-stream"),
    await uploadToGemini("Unknown File", "application/octet-stream"),
    await uploadToGemini("Unknown File", "application/octet-stream"),
    await uploadToGemini("Unknown File", "application/octet-stream"),
    await uploadToGemini("Unknown File", "application/octet-stream"),
    await uploadToGemini("Unknown File", "application/octet-stream"),
    await uploadToGemini("Unknown File", "application/octet-stream"),
  ];

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "Hari sent : michle update jira board by the weekend"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n{\n  \"is_task\": true,\n  \"response\": {\n    \"assignee\": \"michle\",\n    \"created_by\": \"hari\",\n    \"end_time\": \"weekend\",\n    \"start_time\": \"now\",\n    \"description\": \"update jira board\",\n    \"task_title\": \"update jira board\"\n  }\n}"},
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Hello world"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n{\n  \"is_task\": false\n}"},
          {
            fileData: {
              mimeType: files[1].mimeType,
              fileUri: files[1].uri,
            },
          },
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Ash sent: Im doing good, how about you"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n{\n  \"is_task\": false\n}"},
          {
            fileData: {
              mimeType: files[2].mimeType,
              fileUri: files[2].uri,
            },
          },
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Ash sent: Assign task to hari to add example of key value pair for model fine tuning by tonight"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n{\n  \"is_task\": true,\n  \"response\": {\n    \"assignee\": \"hari\",\n    \"created_by\": \"ash\",\n    \"end_time\": \"tonight\",\n    \"start_time\": \"now\",\n    \"description\": \"add example of key value pair for model fine tuning\",\n    \"task_title\": \"add example of key value pair for model fine tuning\"\n  }\n}"},
          {
            fileData: {
              mimeType: files[3].mimeType,
              fileUri: files[3].uri,
            },
          },
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Karthik sent: Create a new feature to allow users to filter by category."},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n{\n  \"is_task\": true,\n  \"response\": {\n    \"assignee\": \"self\",\n    \"created_by\": \"karthik\",\n    \"end_time\": \"unset\",\n    \"start_time\": \"now\",\n    \"description\": \"Create a new feature to allow users to filter by category.\",\n    \"task_title\": \"Create filter by category feature\"\n  }\n}"},
          {
            fileData: {
              mimeType: files[4].mimeType,
              fileUri: files[4].uri,
            },
          },
        ],
      },
      {
        role: "user",
        parts: [
          {text: "\"1734001016.416219 : <self> sent: Can you please review the design mockups?\",\n\"1734001018.416479 : Ash sent: Im on leave from tomorrow, will not be able to work on any task\",\n\"1734001020.416764 : Hari sent : Im out of station till next month. Hence on leave from work.\""},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n{\n  \"is_task\": true,\n  \"response\": {\n    \"assignee\": \"self\",\n    \"created_by\": \"self\",\n    \"end_time\": \"unset\",\n    \"start_time\": \"now\",\n    \"description\": \"review the design mockups\",\n    \"task_title\": \"review design mockups\"\n  }\n}"},
          {
            fileData: {
              mimeType: files[5].mimeType,
              fileUri: files[5].uri,
            },
          },
        ],
      },
      {
        role: "user",
        parts: [
          {text: "\"1734001018.416479 : Ash sent: Im on leave from tomorrow, will not be able to work on any task\",\n\"1734001020.416764 : Hari sent : Im out of station till next month. Hence on leave from work.\",\n\"1734001016.416219 : <self> sent: Can you please review the design mockups?\",\n\"1734001014.416042 : <self> sent: Let's schedule a meeting to discuss the project plan.\","},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n{\n  \"is_task\": true,\n  \"response\": [\n    {\n      \"assignee\": \"self\",\n      \"created_by\": \"self\",\n      \"end_time\": \"unset\",\n      \"start_time\": \"now\",\n      \"description\": \"review the design mockups\",\n      \"task_title\": \"review design mockups\"\n    },\n    {\n       \"assignee\": \"all\",\n      \"created_by\": \"self\",\n      \"end_time\": \"unset\",\n      \"start_time\": \"now\",\n      \"description\": \"schedule a meeting to discuss the project plan\",\n      \"task_title\": \"schedule project plan meeting\"\n    }\n  ]\n}"},
          {
            fileData: {
              mimeType: files[6].mimeType,
              fileUri: files[6].uri,
            },
          },
        ],
      },
      {
        role: "user",
        parts: [
          {text: "\"1734000988.412799 : Siva sent : Someone Update on DC stats\","},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n{\n  \"is_task\": true,\n  \"response\":  [\n     {\n    \"assignee\": \"open\",\n    \"created_by\": \"siva\",\n    \"end_time\": \"unset\",\n    \"start_time\": \"now\",\n    \"description\": \"update on dc stats\",\n    \"task_title\": \"update on dc stats\"\n    }\n    ]\n}"},
          {
            fileData: {
              mimeType: files[7].mimeType,
              fileUri: files[7].uri,
            },
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run();



<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyC0eNs_oWCLuJKxkk__zeuqwreYKlrawgs",
    authDomain: "rosy-resolver-444504-h1.firebaseapp.com",
    projectId: "rosy-resolver-444504-h1",
    storageBucket: "rosy-resolver-444504-h1.firebasestorage.app",
    messagingSenderId: "740930468491",
    appId: "1:740930468491:web:5caae81d583d65b802b28e",
    measurementId: "G-YG8KY7WWDV"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>


npm install -g firebase-tools

firebase login

firebase init

firebase deploy

