FROM python:3.9-slim-buster
WORKDIR /app
ADD . /app

RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 4100

# Run app.py when the container launches
CMD ["gunicorn", "app:app", "-b", "[::]:4100"]
