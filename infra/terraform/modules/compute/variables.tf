// ----------------------- //
// COMPUTE MODULE VARIABLES //
// ----------------------- //

variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "zone" {
  description = "Google Cloud zone"
  type        = string
  default     = "us-central1-c"
}

variable "region" {
  description = "Google Cloud region"
  type        = string
  default     = "us-central1"
}

variable "machine_type" {
  description = "Machine type for compute instances"
  type        = string
  default     = "e2-medium"
}

variable "instance_name" {
  description = "Name prefix for compute instances"
  type        = string
  default     = "aegisnet-vm"
}

variable "network" {
  description = "Network to attach instances to"
  type        = string
  default     = "default"
}

variable "subnetwork" {
  description = "Subnetwork to attach instances to"
  type        = string
  default     = ""
}

variable "service_account_email" {
  description = "Service account email for compute instances"
  type        = string
  default     = ""
}

variable "boot_disk_image" {
  description = "Boot disk image"
  type        = string
  default     = "debian-cloud/debian-11"
}

variable "boot_disk_size_gb" {
  description = "Size of boot disk in GB"
  type        = number
  default     = 20
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
