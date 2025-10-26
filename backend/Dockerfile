FROM python:3.14.0-slim

WORKDIR /app


# Setup Backend
RUN pip install --no-cache-dir     \
     "requests==2.32.3"            \
     "Flask==3.0.0"                \
     "Flask-RESTful==0.3.10"       \
     "Flask-Cors==4.0.0"           \
     "Flask-SocketIO==5.3.6"       \
     "Flask-Login==0.6.3"


EXPOSE 8000
CMD ["python3", "-u", "main.py", "--http"]
