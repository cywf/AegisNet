#!/bin/bash
# Cloud Deployment Script for AegisNet
# Supports AWS, Azure, and Google Cloud Platform

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

# Function to check if required tools are installed
check_prerequisites() {
    local tool=$1
    if ! command -v $tool &> /dev/null; then
        print_error "$tool is not installed. Please install it first."
        return 1
    fi
    print_success "$tool is installed"
}

# Deploy to Kubernetes
deploy_to_kubernetes() {
    local environment=$1
    
    print_info "Deploying to Kubernetes ($environment environment)..."
    
    # Apply Kubernetes manifests
    kubectl apply -f infra/kubernetes/deployment.yaml
    kubectl apply -f infra/kubernetes/ingress.yaml
    
    # Wait for deployment to be ready
    print_info "Waiting for deployment to be ready..."
    kubectl rollout status deployment/aegisnet-app -n aegisnet --timeout=300s
    
    print_success "Deployment completed successfully!"
    
    # Show deployment info
    echo ""
    print_info "Deployment information:"
    kubectl get all -n aegisnet
}

# Deploy infrastructure with Terraform
deploy_infrastructure() {
    local environment=$1
    local provider=$2
    
    print_info "Deploying infrastructure with Terraform ($provider, $environment)..."
    
    cd infra/terraform
    
    # Initialize Terraform
    terraform init
    
    # Select or create workspace
    terraform workspace select $environment || terraform workspace new $environment
    
    # Plan
    print_info "Creating Terraform plan..."
    terraform plan -out=tfplan
    
    # Apply
    read -p "Do you want to apply this plan? (yes/no) " -r
    if [[ $REPLY == "yes" ]]; then
        terraform apply tfplan
        print_success "Infrastructure deployed successfully!"
    else
        print_warning "Deployment cancelled."
    fi
    
    cd ../..
}

# Deploy to AWS ECS
deploy_to_aws_ecs() {
    print_info "Deploying to AWS ECS..."
    
    # Check AWS CLI
    check_prerequisites "aws" || exit 1
    
    # Build and push Docker image
    local aws_account_id=$(aws sts get-caller-identity --query Account --output text)
    local region=${AWS_DEFAULT_REGION:-us-east-1}
    local repository="aegisnet"
    local tag="latest"
    
    print_info "Building Docker image..."
    docker build -t $repository:$tag .
    
    print_info "Pushing to ECR..."
    aws ecr get-login-password --region $region | docker login --username AWS --password-stdin $aws_account_id.dkr.ecr.$region.amazonaws.com
    docker tag $repository:$tag $aws_account_id.dkr.ecr.$region.amazonaws.com/$repository:$tag
    docker push $aws_account_id.dkr.ecr.$region.amazonaws.com/$repository:$tag
    
    print_success "Image pushed to ECR successfully!"
}

# Main menu
show_menu() {
    echo "========================================"
    echo "  AegisNet Cloud Deployment Script"
    echo "========================================"
    echo ""
    echo "Select deployment target:"
    echo "  1) Deploy infrastructure (Terraform)"
    echo "  2) Deploy to Kubernetes"
    echo "  3) Deploy to AWS ECS"
    echo "  4) Exit"
    echo ""
}

main() {
    show_menu
    read -p "Enter your choice [1-4]: " choice
    
    case $choice in
        1)
            read -p "Enter environment (dev/staging/prod): " env
            read -p "Enter cloud provider (aws/azure/gcp): " provider
            deploy_infrastructure $env $provider
            ;;
        2)
            read -p "Enter environment (dev/staging/prod): " env
            check_prerequisites "kubectl" || exit 1
            deploy_to_kubernetes $env
            ;;
        3)
            deploy_to_aws_ecs
            ;;
        4)
            echo "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please select 1-4."
            exit 1
            ;;
    esac
}

main
