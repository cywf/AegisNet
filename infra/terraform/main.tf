// ------------------- //
// MAIN CONFIGURATION  //
// ------------------- //

# This is the main Terraform configuration file that orchestrates all modules
# Uncomment and configure the modules you need for your deployment

# Local variables for common tags
locals {
  common_tags = {
    Project     = "AegisNet"
    ManagedBy   = "Terraform"
    Environment = var.environment
  }
}

# Example: Network Module (AWS)
# module "network" {
#   source = "./modules/network"
#   
#   environment = var.environment
#   vpc_cidr    = var.vpc_cidr
#   
#   tags = local.common_tags
# }

# Example: Compute Module (Google Cloud)
# module "compute" {
#   source = "./modules/compute"
#   
#   project_id            = var.project_id
#   zone                  = var.zone
#   network               = module.network.vpc_id
#   service_account_email = var.service_account_email
#   
#   tags = local.common_tags
# }

# Example: Storage Module
# module "storage" {
#   source = "./modules/storage"
#   
#   environment = var.environment
#   
#   tags = local.common_tags
# }