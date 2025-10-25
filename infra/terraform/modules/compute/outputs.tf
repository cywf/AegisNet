// ---------------------- //
// COMPUTE MODULE OUTPUTS //
// ---------------------- //

output "instance_id" {
  description = "ID of the compute instance"
  value       = google_compute_instance.main.instance_id
}

output "instance_name" {
  description = "Name of the compute instance"
  value       = google_compute_instance.main.name
}

output "instance_self_link" {
  description = "Self link of the compute instance"
  value       = google_compute_instance.main.self_link
}

output "internal_ip" {
  description = "Internal IP address of the instance"
  value       = google_compute_instance.main.network_interface[0].network_ip
}

output "external_ip" {
  description = "External IP address of the instance (if configured)"
  value       = try(google_compute_instance.main.network_interface[0].access_config[0].nat_ip, null)
}
