module "compute" {
  source        = "terraform-google-modules/vm/google"
  version       = "-> 6.0"

  name          = "vm-instance"
  project_id    = var.project_id
  zone          = var.zone
  machine_type  = "e2-medium"

  boot_disk = {
    initialize_params = {
        image_family    = "debian-9"
        image_project   = "debian-cloud"
    }
  }

  network_interface = {
    network         = var.network
    access_config   = {
        // Ephemeral IP
    }
  }

  service_account = {
    email       = var.service_account_email
    scopes      = ["cloud-platform"]
  }

  metadata = {
    ssh-keys    = "user:$(file(~/.ssh/id_rsa.pub))"
  }
}