.PHONY: help setup build start stop restart clean logs test validate deploy-local deploy-cloud

# Colors for output
GREEN  := \033[0;32m
YELLOW := \033[1;33m
BLUE   := \033[0;34m
NC     := \033[0m # No Color

help: ## Show this help message
	@echo '$(BLUE)AegisNet - Available Commands$(NC)'
	@echo ''
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ''

# Local Development
setup: ## Initial setup for local development
	@echo "$(BLUE)Setting up local development environment...$(NC)"
	@./scripts/setup-local.sh

build: ## Build Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	@docker-compose build

start: ## Start all services
	@echo "$(BLUE)Starting services...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)Services started!$(NC)"
	@docker-compose ps

stop: ## Stop all services
	@echo "$(YELLOW)Stopping services...$(NC)"
	@docker-compose down

restart: ## Restart all services
	@echo "$(YELLOW)Restarting services...$(NC)"
	@docker-compose restart

clean: ## Remove all containers, volumes, and images
	@echo "$(YELLOW)Cleaning up...$(NC)"
	@docker-compose down -v --rmi all

logs: ## Show logs from all services
	@docker-compose logs -f

logs-%: ## Show logs from specific service (e.g., make logs-app)
	@docker-compose logs -f $*

status: ## Show status of all services
	@docker-compose ps

# Terraform
tf-init: ## Initialize Terraform
	@echo "$(BLUE)Initializing Terraform...$(NC)"
	@cd infra/terraform && terraform init

tf-plan: ## Show Terraform plan
	@echo "$(BLUE)Planning Terraform changes...$(NC)"
	@cd infra/terraform && terraform plan

tf-apply: ## Apply Terraform changes
	@echo "$(BLUE)Applying Terraform changes...$(NC)"
	@cd infra/terraform && terraform apply

tf-destroy: ## Destroy Terraform infrastructure
	@echo "$(YELLOW)Destroying Terraform infrastructure...$(NC)"
	@cd infra/terraform && terraform destroy

tf-validate: ## Validate Terraform configuration
	@echo "$(BLUE)Validating Terraform configuration...$(NC)"
	@cd infra/terraform && terraform fmt -check -recursive && terraform validate

tf-fmt: ## Format Terraform files
	@echo "$(BLUE)Formatting Terraform files...$(NC)"
	@cd infra/terraform && terraform fmt -recursive

# Kubernetes
k8s-deploy: ## Deploy to Kubernetes
	@echo "$(BLUE)Deploying to Kubernetes...$(NC)"
	@kubectl apply -f infra/kubernetes/deployment.yaml
	@kubectl apply -f infra/kubernetes/ingress.yaml

k8s-delete: ## Delete Kubernetes resources
	@echo "$(YELLOW)Deleting Kubernetes resources...$(NC)"
	@kubectl delete -f infra/kubernetes/

k8s-status: ## Show Kubernetes deployment status
	@kubectl get all -n aegisnet

k8s-logs: ## Show Kubernetes pod logs
	@kubectl logs -f -l app=aegisnet -n aegisnet

k8s-describe: ## Describe Kubernetes resources
	@kubectl describe deployment aegisnet-app -n aegisnet

# Docker Registry
docker-push: ## Push Docker images to registry
	@echo "$(BLUE)Pushing Docker images...$(NC)"
	@docker-compose push

docker-pull: ## Pull Docker images from registry
	@echo "$(BLUE)Pulling Docker images...$(NC)"
	@docker-compose pull

# Testing
test: ## Run tests
	@echo "$(BLUE)Running tests...$(NC)"
	@echo "$(YELLOW)No tests configured yet$(NC)"

test-unit: ## Run unit tests
	@echo "$(BLUE)Running unit tests...$(NC)"
	@echo "$(YELLOW)No unit tests configured yet$(NC)"

test-integration: ## Run integration tests
	@echo "$(BLUE)Running integration tests...$(NC)"
	@echo "$(YELLOW)No integration tests configured yet$(NC)"

# Linting and Validation
lint: ## Run linters
	@echo "$(BLUE)Running linters...$(NC)"
	@make tf-validate

validate: lint ## Validate all configurations
	@echo "$(BLUE)Validating Docker Compose...$(NC)"
	@docker-compose config > /dev/null && echo "$(GREEN)Docker Compose configuration valid$(NC)"

# Security
security-scan: ## Run security scans
	@echo "$(BLUE)Running security scans...$(NC)"
	@docker run --rm -v $(PWD):/src aquasec/trivy fs --security-checks vuln,config /src

# Monitoring
monitor: ## Open monitoring dashboard
	@echo "$(BLUE)Opening Grafana...$(NC)"
	@open http://localhost:3000 || xdg-open http://localhost:3000

# Documentation
docs: ## Generate documentation
	@echo "$(BLUE)Opening documentation...$(NC)"
	@open docs/DEPLOYMENT.md || xdg-open docs/DEPLOYMENT.md

# Environment
env: ## Create .env file from example
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "$(GREEN).env file created$(NC)"; \
	else \
		echo "$(YELLOW).env file already exists$(NC)"; \
	fi

# CI/CD
ci: validate test ## Run CI checks locally
	@echo "$(GREEN)CI checks passed!$(NC)"

# Quick commands
dev: env build start ## Quick start for development (env + build + start)
	@echo "$(GREEN)Development environment ready!$(NC)"

prod: ## Build production images
	@echo "$(BLUE)Building production images...$(NC)"
	@docker build --target production -t aegisnet:latest .

deploy: ## Deploy using the cloud deployment script
	@./scripts/deploy-cloud.sh

# Info
info: ## Show system information
	@echo "$(BLUE)System Information:$(NC)"
	@echo "Docker version:         $$(docker --version)"
	@echo "Docker Compose version: $$(docker-compose --version || docker compose version)"
	@echo "Terraform version:      $$(terraform --version | head -n1 || echo 'Not installed')"
	@echo "Kubectl version:        $$(kubectl version --client --short 2>/dev/null || echo 'Not installed')"
