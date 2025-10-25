// ----------------------- //
// STORAGE MODULE (GCS)    //
// ----------------------- //

resource "google_storage_bucket" "main" {
  name          = "${var.environment}-aegisnet-storage-${var.project_id}"
  location      = var.location
  storage_class = var.storage_class
  project       = var.project_id
  
  force_destroy = var.force_destroy

  versioning {
    enabled = var.versioning_enabled
  }

  # Enable uniform bucket-level access
  uniform_bucket_level_access = true

  # Lifecycle rules to manage object lifecycle
  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }

  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }

  labels = var.tags
}

# IAM binding for bucket access (customize as needed)
# resource "google_storage_bucket_iam_member" "member" {
#   bucket = google_storage_bucket.main.name
#   role   = "roles/storage.objectViewer"
#   member = "serviceAccount:${var.service_account_email}"
# }
