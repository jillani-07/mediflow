variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "project" {
  description = "Project name"
  type        = string
  default     = "mediflow"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDRs (RDS)"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "ec2_instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"              # free tier eligible
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"           # free tier eligible
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "mediflow_db"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "mediflow_user"
}

variable "db_password" {
  description = "Database master password — set via env var"
  type        = string
  sensitive   = true                    # never printed in logs
}

variable "s3_bucket_name" {
  description = "S3 bucket for file uploads"
  type        = string
  default     = "mediflow-uploads-prod"
}