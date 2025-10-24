FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY . .

# Compile Cython modules
RUN cd ai_engine && python setup.py build_ext --inplace

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Expose port 10000
EXPOSE 10000

# Run migrations and start server
CMD python manage.py migrate && \
    python manage.py runserver 0.0.0.0:10000
