// ----------------------- //
// VARIABLES CONFIGURATION //
// ----------------------- //

# General Variables
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "aegisnet"
}

// ----------- //
// AWS SECTION //
// ----------- //

variable "aws_region" {
  description = "AWS region for resource deployment"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

// Sensitive variables should be passed via environment variables or tfvars file
// variable "aws_access_key" {
//   description = "AWS access key"
//   type        = string
//   sensitive   = true
// }

// variable "aws_secret_key" {
//   description = "AWS secret key"
//   type        = string
//   sensitive   = true
// }

// ------------- //
// AZURE SECTION //
// ------------- //

variable "azure_location" {
  description = "Azure region for resource deployment"
  type        = string
  default     = "eastus"
}

// variable "azure_client_id" {
//   description = "Azure client ID"
//   type        = string
//   sensitive   = true
// }

// variable "azure_client_secret" {
//   description = "Azure client secret"
//   type        = string
//   sensitive   = true
// }

// variable "azure_tenant_id" {
//   description = "Azure tenant ID"
//   type        = string
//   sensitive   = true
// }

// variable "azure_subscription_id" {
//   description = "Azure subscription ID"
//   type        = string
//   sensitive   = true
// }

// -------------- //
// GOOGLE SECTION //
// -------------- //

variable "google_project" {
  description = "Google Cloud project ID"
  type        = string
  default     = ""
}

variable "google_region" {
  description = "Google Cloud region"
  type        = string
  default     = "us-central1"
}

variable "google_zone" {
  description = "Google Cloud zone"
  type        = string
  default     = "us-central1-c"
}

// variable "google_credentials" {
//   description = "Google Cloud credentials JSON"
//   type        = string
//   sensitive   = true
// }

// --------------------- //
// DIGITAL OCEAN SECTION //
// --------------------- //

variable "digitalocean_region" {
  description = "DigitalOcean region"
  type        = string
  default     = "nyc1"
}

// variable "digitalocean_token" {
//   description = "DigitalOcean API token"
//   type        = string
//   sensitive   = true
// }

// -------------- //
// LINODE SECTION //
// -------------- //

// variable "linode_token" {
//   description = "Linode API token"
//   type        = string
//   sensitive   = true
// }

// ------------------ //
// CLOUDFLARE SECTION //
// ------------------ //

// variable "cloudflare_api_token" {
//   description = "Cloudflare API token"
//   type        = string
//   sensitive   = true
// }

// ------------- //
// VULTR SECTION //
// ------------- //

// variable "vultr_api_key" {
//   description = "Vultr API key"
//   type        = string
//   sensitive   = true
// }
