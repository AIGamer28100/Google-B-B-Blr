import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import model, doc

app = Flask(__name__)
CORS(app)


def add_data_firestore(data):
    doc.set(data)


def process_message(message_data):
    print(message_data)
    try:
        # Process the message data
        # Example: Extract the message content
        all_message_content = "Just give me the last task based on the last message of the chat history given below \n\n"
        
        for message in message_data["messages"]:
            if message["message_content"] is not None:
                all_message_content += f"At {message['timestamp']} {message['username']} sent : {message['message_content']}\n"
        
        chat_session = model.start_chat(
            history=[
            ]
        )

        response = chat_session.send_message(all_message_content)

        return {
            "response": json.loads(response.text)
        }
    except Exception as e:
        print(e)
        return {"error": str(e)}


@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "response": "Hello World"
    }), 302


@app.route('/process', methods=['POST'])
def process():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # result =  {
        #     "response": "sample"
        # } 
        result = process_message(data)
        return jsonify(result)

    except Exception as e:
        print(e)
        return {"error": str(e)}, 500


@app.route('/add_task', methods='POST')
def add_task():
    pass

@app.route('/get_tasks', methods='POST')
def add_task():
    task_data = doc.get()
    if task_data.exists:
        return jsonify(task_data.to_dict()), 200
    else:
        return jsonify({'message': 'Document not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
