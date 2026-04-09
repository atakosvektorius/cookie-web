FROM python:3.13.11-slim

WORKDIR /app


# Setup Backend
RUN pip install --no-cache-dir     \
     "requests==2.32.5"            \
     "Flask==3.1.2"                \
     "Flask-RESTful==0.3.10"       \
     "Flask-Cors==6.0.2"           \
     "Flask-SocketIO==5.6.0"       \
     "Flask-Login==0.6.3"


COPY . .

EXPOSE 8000
CMD ["python3", "-u", "main.py", "--http"]
