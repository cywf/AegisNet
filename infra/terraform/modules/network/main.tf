// ---------------------- //
// NETWORK MODULE (AWS)   //
// ---------------------- //

module "vpc" {
    source  = "terraform-aws-modules/vpc/aws"
    version = "~> 5.0"

    name = "${var.environment}-aegisnet-vpc"
    cidr = var.vpc_cidr
    
    azs             = var.azs
    private_subnets = var.private_subnet_cidrs
    public_subnets  = var.public_subnet_cidrs

    enable_nat_gateway = var.enable_nat_gateway
    enable_vpn_gateway = var.enable_vpn_gateway
    
    # Enable DNS support
    enable_dns_hostnames = true
    enable_dns_support   = true

    tags = merge(
      var.tags,
      {
        Name        = "${var.environment}-aegisnet-vpc"
        Environment = var.environment
      }
    )
}