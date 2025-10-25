// --------------------- //
// OUTPUTS CONFIGURATION //
// --------------------- //

# Infrastructure outputs that can be used by other systems or for documentation

# Example: Network outputs
# output "vpc_id" {
#   description = "ID of the VPC"
#   value       = module.network.vpc_id
# }

# output "public_subnet_ids" {
#   description = "IDs of public subnets"
#   value       = module.network.public_subnet_ids
# }

# output "private_subnet_ids" {
#   description = "IDs of private subnets"
#   value       = module.network.private_subnet_ids
# }

# Example: Compute outputs
# output "instance_ids" {
#   description = "IDs of compute instances"
#   value       = module.compute.instance_ids
# }

# output "instance_public_ips" {
#   description = "Public IP addresses of compute instances"
#   value       = module.compute.public_ips
#   sensitive   = true
# }

# Example: Storage outputs
# output "storage_bucket_name" {
#   description = "Name of the storage bucket"
#   value       = module.storage.bucket_name
# }

# General outputs
output "environment" {
  description = "Deployment environment"
  value       = var.environment
}

output "project_name" {
  description = "Project name"
  value       = var.project_name
}
