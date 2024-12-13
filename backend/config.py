import os
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content

import firebase_admin
from firebase_admin import firestore, credentials


genai.configure(api_key="AIzaSyApmsZECdlT1yJ52FYua-SezjYYfSi4kAA")

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_schema": content.Schema(
    type = content.Type.OBJECT,
    enum = [],
    required = ["is_task"],
    properties = {
      "response": content.Schema(
        type = content.Type.ARRAY,
        items = content.Schema(
          type = content.Type.OBJECT,
          enum = [],
          required = ["start_time", "end_time", "assignee", "created_by"],
          properties = {
            "task_title": content.Schema(
              type = content.Type.STRING,
            ),
            "description": content.Schema(
              type = content.Type.STRING,
            ),
            "start_time": content.Schema(
              type = content.Type.STRING,
            ),
            "end_time": content.Schema(
              type = content.Type.STRING,
            ),
            "assignee": content.Schema(
              type = content.Type.STRING,
            ),
            "created_by": content.Schema(
              type = content.Type.STRING,
            ),
          },
        ),
      ),
      "is_task": content.Schema(
        type = content.Type.BOOLEAN,
      ),
    },
  ),
  "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
  model_name="gemini-2.0-flash-exp",
  generation_config=generation_config,
  system_instruction="convert conversations into task if applicable using the below format:\n\nif the message is not a task : \n\n```json\n{\n  \"is_task\": false\n}\n```\n\nif the message is a task: \n\n```json\n{\n  \"istask\": true,\n  \"response\": {\n    \"title\" : \"<simple title>\"\n    \"description\": \"<detailed description>\",\n    \"startDate\": \"<now>\",\n    \"endDate\": \"<unset>,\n    \"assignee\" : \"<self>\",\n     \"created_by\": \"<self>\",\n  }\n}\n```",
)

# Use the application default credentials.
cred = credentials.ApplicationDefault()

firebase_admin.initialize_app(cred)
db = firestore.client()
# firebaseConfig = {
#   "apiKey": "AIzaSyC0eNs_oWCLuJKxkk__zeuqwreYKlrawgs",
#   "authDomain": "rosy-resolver-444504-h1.firebaseapp.com",
#   "projectId": "rosy-resolver-444504-h1",
#   "storageBucket": "rosy-resolver-444504-h1.firebasestorage.app",
#   "messagingSenderId": "740930468491",
#   "appId": "1:740930468491:web:413bbeac07b7f41602b28e",
#   "measurementId": "G-C965EMVPH1"
# }
doc = db.collection("task_data").document("WgmnBThKInyhsPf32i1c")