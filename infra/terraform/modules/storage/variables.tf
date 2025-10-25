// ----------------------- //
// STORAGE MODULE VARIABLES //
// ----------------------- //

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "project_id" {
  description = "Cloud project ID (for cloud-based storage)"
  type        = string
  default     = ""
}

variable "location" {
  description = "Storage location/region"
  type        = string
  default     = "us-central1"
}

variable "storage_class" {
  description = "Storage class (STANDARD, NEARLINE, COLDLINE, ARCHIVE)"
  type        = string
  default     = "STANDARD"
}

variable "force_destroy" {
  description = "Allow destruction of non-empty bucket"
  type        = bool
  default     = false
}

variable "versioning_enabled" {
  description = "Enable versioning for stored objects"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
