// ------------------------- //
// COMPUTE MODULE (GCP)      //
// ------------------------- //

resource "google_compute_instance" "main" {
  name         = var.instance_name
  machine_type = var.machine_type
  zone         = var.zone
  project      = var.project_id

  boot_disk {
    initialize_params {
      image = var.boot_disk_image
      size  = var.boot_disk_size_gb
      type  = "pd-standard"
    }
  }

  network_interface {
    network    = var.network
    subnetwork = var.subnetwork != "" ? var.subnetwork : null

    # Assign external IP if needed
    access_config {
      // Ephemeral external IP
    }
  }

  # Service account for the instance
  service_account {
    email  = var.service_account_email != "" ? var.service_account_email : null
    scopes = ["cloud-platform"]
  }

  # Metadata for SSH access (optional - configure as needed)
  metadata = {
    enable-oslogin = "TRUE"
  }

  # Apply tags
  labels = var.tags

  # Allow stopping for updates
  allow_stopping_for_update = true
}