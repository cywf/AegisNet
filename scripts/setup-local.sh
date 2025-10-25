#!/bin/bash
# Local Development Setup Script for AegisNet

set -e

echo "========================================"
echo "AegisNet Local Development Setup"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_success "Docker is installed"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose is installed"
}

# Create .env file from example if it doesn't exist
setup_env() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        print_success ".env file created. Please update it with your configuration."
    else
        print_success ".env file already exists"
    fi
}

# Build Docker images
build_images() {
    echo ""
    echo "Building Docker images..."
    docker-compose build
    print_success "Docker images built successfully"
}

# Start services
start_services() {
    echo ""
    echo "Starting services..."
    docker-compose up -d
    print_success "Services started successfully"
}

# Show service status
show_status() {
    echo ""
    echo "Service Status:"
    docker-compose ps
}

# Main execution
main() {
    echo ""
    check_docker
    check_docker_compose
    setup_env
    
    echo ""
    read -p "Do you want to build and start the services now? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        build_images
        start_services
        show_status
        
        echo ""
        print_success "Setup complete!"
        echo ""
        echo "Useful commands:"
        echo "  docker-compose logs -f         # View logs"
        echo "  docker-compose ps              # Check service status"
        echo "  docker-compose down            # Stop services"
        echo "  docker-compose restart         # Restart services"
        echo ""
    else
        print_warning "Skipping service startup. Run 'docker-compose up -d' when ready."
    fi
}

main
