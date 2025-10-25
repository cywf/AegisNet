# AegisNet Terraform Infrastructure

This directory contains Terraform configurations for provisioning AegisNet infrastructure across multiple cloud providers.

## Structure

```
terraform/
├── main.tf           # Main configuration orchestrating modules
├── variables.tf      # Input variables
├── outputs.tf        # Output values
├── versions.tf       # Provider version constraints
├── backend.tf        # Backend configuration for state storage
├── providers.tf      # Provider configurations
└── modules/
    ├── network/      # Network/VPC module
    ├── compute/      # Compute/VM instances module
    └── storage/      # Storage/buckets module
```

## Supported Cloud Providers

- **AWS**: VPC, EC2, S3
- **Azure**: Resource Groups, Virtual Networks, VMs
- **Google Cloud**: VPC, Compute Engine, Cloud Storage
- **DigitalOcean**: Droplets, Spaces

## Prerequisites

- Terraform >= 1.0.0
- Cloud provider CLI tools (optional but recommended)
- Appropriate cloud provider credentials

## Usage

### 1. Configure Backend

Edit `backend.tf` and uncomment your preferred backend:

```hcl
# For local development
terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}

# For AWS S3
terraform {
  backend "s3" {
    bucket = "aegisnet-terraform-state"
    key    = "infrastructure/terraform.tfstate"
    region = "us-east-1"
  }
}
```

### 2. Create Variables File

Create `terraform.tfvars`:

```hcl
environment  = "dev"
project_name = "aegisnet"

# AWS
aws_region = "us-east-1"
vpc_cidr   = "10.0.0.0/16"

# Google Cloud
google_project = "aegisnet-dev"
google_region  = "us-central1"
```

### 3. Initialize Terraform

```bash
terraform init
```

### 4. Plan Changes

```bash
terraform plan
```

### 5. Apply Configuration

```bash
terraform apply
```

## Modules

### Network Module (AWS)

Creates a VPC with public and private subnets, NAT gateways, and routing tables.

**Inputs:**
- `environment`: Environment name (dev/staging/prod)
- `vpc_cidr`: VPC CIDR block
- `azs`: List of availability zones
- `enable_nat_gateway`: Enable NAT gateway for private subnets

**Outputs:**
- `vpc_id`: VPC identifier
- `public_subnet_ids`: List of public subnet IDs
- `private_subnet_ids`: List of private subnet IDs

### Compute Module (GCP)

Creates compute instances on Google Cloud Platform.

**Inputs:**
- `project_id`: GCP project ID
- `zone`: GCP zone
- `machine_type`: Instance type
- `boot_disk_image`: Boot disk image

**Outputs:**
- `instance_id`: Compute instance ID
- `internal_ip`: Internal IP address
- `external_ip`: External IP address

### Storage Module (GCP)

Creates cloud storage buckets with lifecycle policies.

**Inputs:**
- `environment`: Environment name
- `project_id`: GCP project ID
- `location`: Storage location
- `storage_class`: Storage class (STANDARD, NEARLINE, etc.)

**Outputs:**
- `bucket_name`: Storage bucket name
- `bucket_url`: Storage bucket URL

## Environments

Use Terraform workspaces for different environments:

```bash
# Create and switch to dev workspace
terraform workspace new dev
terraform workspace select dev

# Apply configuration
terraform apply
```

## Best Practices

1. **State Management**
   - Use remote state storage (S3, GCS, Terraform Cloud)
   - Enable state locking (DynamoDB for S3)
   - Never commit state files to version control

2. **Secrets Management**
   - Never hardcode credentials
   - Use environment variables or secret managers
   - Mark sensitive variables as `sensitive = true`

3. **Module Organization**
   - Keep modules focused and reusable
   - Version your modules
   - Use consistent naming conventions

4. **Testing**
   - Always run `terraform plan` before `apply`
   - Use `terraform validate` to check syntax
   - Test in dev environment first

## Troubleshooting

### State Lock Errors

If state is locked:
```bash
terraform force-unlock <lock-id>
```

### Provider Authentication

**AWS:**
```bash
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
```

**Google Cloud:**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
```

**Azure:**
```bash
az login
```

## Security Considerations

- Enable encryption at rest for state storage
- Use IAM roles instead of access keys when possible
- Implement least privilege access
- Regularly rotate credentials
- Enable audit logging

## Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
