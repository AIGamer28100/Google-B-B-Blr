FROM python:3.9-slim-buster

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:" + os.environ.get("PORT", "8080"), "--workers=1", "--threads=8", "main:app"]