# AegisNet Infrastructure Directory

This directory contains all infrastructure-as-code (IaC) for deploying AegisNet across various environments.

## Contents

- **terraform/**: Terraform configurations for cloud infrastructure provisioning
- **kubernetes/**: Kubernetes manifests for container orchestration
- **monitoring/**: Configuration for monitoring and observability (future)

## Quick Start

### Terraform

Deploy cloud infrastructure:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

See the [Terraform README](./terraform/README.md) for detailed instructions.

### Kubernetes

Deploy to Kubernetes cluster:

```bash
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/ingress.yaml
```

See the [Kubernetes README](./kubernetes/README.md) for detailed instructions.

## Documentation

For comprehensive deployment instructions, see:
- [Deployment Guide](../docs/DEPLOYMENT.md)
- [Architecture Documentation](../docs/ARCHITECTURE.md)
