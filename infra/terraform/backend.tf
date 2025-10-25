// --------------------- //
// BACKEND CONFIGURATION //
// --------------------- //

# Backend configuration for Terraform state management
# Uncomment and configure based on your deployment strategy

# Option 1: Local backend (for development/testing)
# terraform {
#   backend "local" {
#     path = "terraform.tfstate"
#   }
# }

# Option 2: S3 backend (AWS)
# terraform {
#   backend "s3" {
#     bucket         = "aegisnet-terraform-state"
#     key            = "infrastructure/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "aegisnet-terraform-locks"
#   }
# }

# Option 3: Azure Storage backend
# terraform {
#   backend "azurerm" {
#     resource_group_name  = "aegisnet-tfstate-rg"
#     storage_account_name = "aegisnettfstate"
#     container_name       = "tfstate"
#     key                  = "infrastructure.tfstate"
#   }
# }

# Option 4: Google Cloud Storage backend
# terraform {
#   backend "gcs" {
#     bucket  = "aegisnet-terraform-state"
#     prefix  = "infrastructure"
#   }
# }

# Option 5: Terraform Cloud backend (Recommended for team collaboration)
# terraform {
#   backend "remote" {
#     organization = "aegisnet"
#     
#     workspaces {
#       name = "aegisnet-infrastructure"
#     }
#   }
# }
