module "vpc" {
  source = "./modules/vpc"

  project              = var.project
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}

module "ec2" {
  source = "./modules/ec2"

  project           = var.project
  aws_region        = var.aws_region
  vpc_id            = module.vpc.vpc_id
  public_subnet_id  = module.vpc.public_subnet_ids[0]
  ec2_instance_type = var.ec2_instance_type
  s3_bucket_name    = var.s3_bucket_name
}

module "rds" {
  source = "./modules/rds"

  project            = var.project
  db_instance_class  = var.db_instance_class
  db_name            = var.db_name
  db_username        = var.db_username
  db_password        = var.db_password
  private_subnet_ids = module.vpc.private_subnet_ids
  rds_sg_id          = module.ec2.rds_sg_id
}

module "s3" {
  source = "./modules/s3"

  s3_bucket_name = var.s3_bucket_name
}

# Auto-detect your current IP for SSH rule
data "http" "my_ip" {
  url = "https://checkip.amazonaws.com"
}

module "alb" {
  source = "./modules/alb"

  project           = var.project
  vpc_id            = module.vpc.vpc_id
  alb_sg_id         = module.ec2.alb_sg_id
  public_subnet_ids = module.vpc.public_subnet_ids
  instance_id       = module.ec2.instance_id
}