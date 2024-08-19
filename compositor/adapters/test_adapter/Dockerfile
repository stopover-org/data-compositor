# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    libx11-6 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpangoft2-1.0-0 \
    libatk1.0-0 \
    libcups2 \
    libnss3 \
    libxss1 \
    libxtst6 \
    libgtk-3-0 \
    libglib2.0-0 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libatk-bridge2.0-0 \
    xdg-utils \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Playwright and dependencies
RUN pip install --upgrade pip
RUN pip install neo4j playwright
RUN playwright install

# Copy the current directory contents into the container at /app
COPY . .

# Run the command to start the scraper
CMD ["python", "main.py"]
