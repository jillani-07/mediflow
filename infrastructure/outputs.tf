output "ec2_public_ip" {
  description = "EC2 instance public IP"
  value       = module.ec2.public_ip
}

output "rds_endpoint" {
  description = "RDS connection endpoint"
  value       = module.rds.db_endpoint
  sensitive   = true
}

output "s3_bucket" {
  description = "S3 bucket name"
  value       = module.s3.bucket_name
}