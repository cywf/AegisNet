# AegisNet Dockerfile
# Multi-stage build for production-ready deployments

# Stage 1: Base image with common dependencies
FROM ubuntu:22.04 AS base

LABEL maintainer="AegisNet Team"
LABEL description="AegisNet Defense Platform"

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV TZ=UTC

# Install base dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    ca-certificates \
    gnupg \
    lsb-release \
    software-properties-common \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Stage 2: Development environment
FROM base AS development

WORKDIR /app

# Install development tools
RUN apt-get update && apt-get install -y \
    vim \
    nano \
    htop \
    net-tools \
    iputils-ping \
    && rm -rf /var/lib/apt/lists/*

# Copy application files
COPY . /app/

# Install Python dependencies (when requirements.txt is added)
# RUN pip3 install --no-cache-dir -r requirements.txt

CMD ["/bin/bash"]

# Stage 3: Production environment
FROM base AS production

WORKDIR /app

# Copy only necessary files for production
COPY . /app/

# Install production dependencies only
# RUN pip3 install --no-cache-dir -r requirements.txt --no-dev

# Create non-root user for security
RUN useradd -m -u 1000 aegisnet && \
    chown -R aegisnet:aegisnet /app

USER aegisnet

# Expose ports (configure based on your services)
# EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Run application
# CMD ["python3", "main.py"]
CMD ["/bin/bash"]
