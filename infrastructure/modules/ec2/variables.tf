variable "project"           { type = string }
variable "aws_region"        { type = string }
variable "vpc_id"            { type = string }
variable "public_subnet_id"  { type = string }
variable "ec2_instance_type" { type = string }
variable "s3_bucket_name"    { type = string }
variable "key_pair_name"     { type = string }
variable "allowed_ssh_cidr"  { type = string }