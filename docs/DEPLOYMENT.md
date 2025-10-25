# AegisNet Deployment Guide

This guide provides comprehensive instructions for deploying AegisNet in various environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Cloud Deployment](#cloud-deployment)
4. [Autonomous Deployment](#autonomous-deployment)
5. [Configuration](#configuration)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

- **Docker** (>= 20.10): For containerized deployments
- **Docker Compose** (>= 2.0): For local multi-container setup
- **Terraform** (>= 1.0): For infrastructure provisioning
- **kubectl** (>= 1.25): For Kubernetes deployments
- **Git**: For version control

### Cloud Provider CLI Tools (Optional)

- **AWS CLI** (>= 2.0): For AWS deployments
- **Azure CLI** (>= 2.40): For Azure deployments
- **gcloud** (>= 400.0): For Google Cloud deployments

## Local Development

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/cywf/AegisNet.git
   cd AegisNet
   ```

2. **Run the setup script**
   ```bash
   ./scripts/setup-local.sh
   ```

3. **Verify the deployment**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

### Manual Setup

If you prefer manual setup:

1. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Build and start services**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

3. **Check service status**
   ```bash
   docker-compose ps
   ```

### Development Workflow

- **View logs**: `docker-compose logs -f [service_name]`
- **Restart services**: `docker-compose restart [service_name]`
- **Stop services**: `docker-compose down`
- **Rebuild after changes**: `docker-compose up -d --build`

## Cloud Deployment

### Infrastructure Provisioning with Terraform

#### Step 1: Configure Terraform Backend

Edit `infra/terraform/backend.tf` and uncomment your preferred backend configuration:

**For AWS S3:**
```hcl
terraform {
  backend "s3" {
    bucket         = "aegisnet-terraform-state"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "aegisnet-terraform-locks"
  }
}
```

**For Terraform Cloud:**
```hcl
terraform {
  backend "remote" {
    organization = "aegisnet"
    workspaces {
      name = "aegisnet-infrastructure"
    }
  }
}
```

#### Step 2: Configure Variables

Create a `terraform.tfvars` file:

```hcl
environment  = "production"
project_name = "aegisnet"

# AWS Configuration
aws_region = "us-east-1"
vpc_cidr   = "10.0.0.0/16"

# Google Cloud Configuration
google_project = "aegisnet-prod"
google_region  = "us-central1"
```

#### Step 3: Deploy Infrastructure

```bash
cd infra/terraform

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply changes
terraform apply
```

### Kubernetes Deployment

#### Prerequisites

- A running Kubernetes cluster (EKS, GKE, AKS, or local with minikube/kind)
- kubectl configured to access your cluster

#### Deploy to Kubernetes

1. **Create namespace and secrets**
   ```bash
   kubectl create namespace aegisnet
   
   # Create secrets (update with actual values)
   kubectl create secret generic aegisnet-secrets \
     --from-literal=DB_PASSWORD=your_password \
     --from-literal=API_KEY=your_api_key \
     -n aegisnet
   ```

2. **Deploy application**
   ```bash
   kubectl apply -f infra/kubernetes/deployment.yaml
   kubectl apply -f infra/kubernetes/ingress.yaml
   ```

3. **Verify deployment**
   ```bash
   kubectl get all -n aegisnet
   kubectl rollout status deployment/aegisnet-app -n aegisnet
   ```

4. **Access the application**
   ```bash
   # Get the external IP
   kubectl get service aegisnet-service -n aegisnet
   ```

### Cloud-Specific Deployments

#### AWS (ECS/EKS)

```bash
# Using the deployment script
./scripts/deploy-cloud.sh

# Select option 3 for AWS ECS
# Or option 2 for Kubernetes (EKS)
```

#### Azure (AKS)

1. **Create AKS cluster**
   ```bash
   az aks create \
     --resource-group aegisnet-rg \
     --name aegisnet-cluster \
     --node-count 3 \
     --enable-managed-identity
   ```

2. **Get credentials**
   ```bash
   az aks get-credentials \
     --resource-group aegisnet-rg \
     --name aegisnet-cluster
   ```

3. **Deploy using kubectl**
   ```bash
   kubectl apply -f infra/kubernetes/
   ```

#### Google Cloud (GKE)

1. **Create GKE cluster**
   ```bash
   gcloud container clusters create aegisnet-cluster \
     --zone us-central1-a \
     --num-nodes 3 \
     --machine-type e2-medium
   ```

2. **Get credentials**
   ```bash
   gcloud container clusters get-credentials aegisnet-cluster \
     --zone us-central1-a
   ```

3. **Deploy using kubectl**
   ```bash
   kubectl apply -f infra/kubernetes/
   ```

## Autonomous Deployment

For autonomous deployment scenarios (edge computing, tactical operations):

### Prerequisites

- Kubernetes distribution for edge: K3s, MicroK8s, or KubeEdge
- Automated deployment tools: ArgoCD or Flux

### K3s Deployment (Lightweight Kubernetes)

1. **Install K3s**
   ```bash
   curl -sfL https://get.k3s.io | sh -
   ```

2. **Deploy AegisNet**
   ```bash
   export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
   kubectl apply -f infra/kubernetes/
   ```

### GitOps with ArgoCD

1. **Install ArgoCD**
   ```bash
   kubectl create namespace argocd
   kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
   ```

2. **Create Application**
   ```bash
   argocd app create aegisnet \
     --repo https://github.com/cywf/AegisNet.git \
     --path infra/kubernetes \
     --dest-server https://kubernetes.default.svc \
     --dest-namespace aegisnet \
     --sync-policy automated
   ```

### Offline Deployment

For air-gapped or offline environments:

1. **Export Docker images**
   ```bash
   docker save aegisnet:latest -o aegisnet-image.tar
   ```

2. **Transfer to target system**

3. **Load and deploy**
   ```bash
   docker load -i aegisnet-image.tar
   docker-compose up -d
   ```

## Configuration

### Environment Variables

Key configuration options in `.env`:

```bash
# Environment
ENVIRONMENT=production
LOG_LEVEL=INFO

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=aegisnet
DB_USER=aegisnet
DB_PASSWORD=<secure_password>

# Cloud Provider Credentials
AWS_REGION=us-east-1
GOOGLE_PROJECT_ID=aegisnet-prod
```

### Secrets Management

**For Production:** Use a secrets manager:

- **AWS Secrets Manager**
- **Azure Key Vault**
- **Google Secret Manager**
- **HashiCorp Vault**

Example with AWS Secrets Manager:
```bash
aws secretsmanager create-secret \
  --name aegisnet/db/password \
  --secret-string "your-secure-password"
```

## Monitoring

### Prometheus and Grafana

Uncomment monitoring services in `docker-compose.yml`:

```bash
# Start monitoring stack
docker-compose up -d prometheus grafana

# Access Grafana
open http://localhost:3000
```

### Kubernetes Monitoring

Deploy Prometheus Operator:
```bash
kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/bundle.yaml
```

## Troubleshooting

### Common Issues

#### Docker Issues

**Container won't start:**
```bash
# Check logs
docker-compose logs [service_name]

# Check container status
docker ps -a

# Restart service
docker-compose restart [service_name]
```

#### Kubernetes Issues

**Pods not starting:**
```bash
# Check pod status
kubectl get pods -n aegisnet

# View pod logs
kubectl logs <pod-name> -n aegisnet

# Describe pod for events
kubectl describe pod <pod-name> -n aegisnet
```

**Image pull errors:**
```bash
# Verify image exists
docker images | grep aegisnet

# Check image pull secrets
kubectl get secrets -n aegisnet
```

#### Terraform Issues

**State lock errors:**
```bash
# Force unlock (use with caution)
terraform force-unlock <lock-id>
```

**Provider authentication errors:**
- Verify cloud provider credentials
- Check IAM permissions
- Ensure correct region configuration

### Getting Help

- **GitHub Issues**: https://github.com/cywf/AegisNet/issues
- **Documentation**: Check the `docs/` directory
- **Logs**: Always include relevant logs when seeking help

## Next Steps

- Review [Architecture Documentation](./ARCHITECTURE.md)
- Configure [Security Settings](./SECURITY.md)
- Set up [CI/CD Pipelines](./.github/workflows/)
