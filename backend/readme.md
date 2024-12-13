# Flask App

## Introduction
This is a simple Flask application integrated with Google Firestore and GenAI keys.

## Requirements
- Python 3.x
- Flask
- Conda
- Google Firestore IAM Key (as .json file)
- Google GenAI API Key

## Installation
3. Create a conda environment:
    ```bash
    conda create --name myenv python=3.x
    ```
4. Activate the conda environment:
    ```bash
    conda activate myenv
    ```
5. Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Setting Up Google Firestore and GenAI Keys

1. Follow the [Google Firestore documentation](https://firebase.google.com/docs/firestore/quickstart) to set up Firestore and get the IAM key as a .json file

2. Setup AI studio and [Get API Key](https://aistudio.google.com/apikey).

3. Add your Firestore and GenAI keys to your environment variables:
    
    - Save the firestore key file in the root directory of the project.
    
    - Update the GenAI key in the `config.py` file line 9.

## Running the App

1. Run the Flask application:
    ```bash
    python app.py
    ```

## Usage

- Open your web browser and go to `http://127.0.0.1:8080/`.

## Contributing

1. Fork the repository.

2. Create a new branch:

    ```bash
    git checkout -b feature-branch
    ```

3. Make your changes and commit them:

    ```bash
    git commit -m "Description of changes"
    ```

4. Push to the branch:

    ```bash
    git push origin feature-branch
    ```
5. Create a pull request.
