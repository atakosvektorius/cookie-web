FROM python:3.13.12

WORKDIR /app


# Django + extensions
RUN pip install --no-cache-dir                  \
    django==5.2.12                              \
    django-environ==0.13.0                      \
    django-cors-headers==4.9.0                  \
    django-filter==25.2                         \
    django-taggit==6.1.0                        \
    django-tinymce==5.0.0                       \
    django-extensions==4.1                      \
    django-debug-toolbar==6.2.0

# DRF
RUN pip install --no-cache-dir                  \
    djangorestframework==3.16.1

# Infrastructure
RUN pip install --no-cache-dir                  \
    argon2-cffi==25.1.0                         \
    whitenoise==6.12.0                          \
    Pillow==12.1.1                              \
    psycopg2-binary==2.9.11                     \
    gunicorn==25.1.0                            \
    Werkzeug==3.1.6                             \
    redis==5.3.0

# Data/visualization
RUN pip install --no-cache-dir                  \
    numpy==2.4.3                                \
    geopandas==1.1.3                            \
    matplotlib==3.10.8                          \
    plotly==6.6.0                               \
    pyvis==0.3.2                                \
    networkx==3.6.1                             \
    openpyxl==3.1.5



# Copy source code
COPY . .


# Run server
EXPOSE 8000
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
