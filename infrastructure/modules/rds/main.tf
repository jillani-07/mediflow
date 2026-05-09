# ── Subnet Group — RDS lives in private subnets only ──────
resource "aws_db_subnet_group" "main" {
  name       = "${var.project}-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = { Name = "${var.project}-db-subnet-group" }
}

# ── RDS PostgreSQL ────────────────────────────────────────
resource "aws_db_instance" "postgres" {
  identifier        = "${var.project}-postgres"
  engine            = "postgres"
  engine_version    = "16.1"
  instance_class    = var.db_instance_class

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.rds_sg_id]

  # Free tier settings
  allocated_storage     = 20
  max_allocated_storage = 20              # disable autoscaling on free tier
  storage_type          = "gp2"

  # Security
  storage_encrypted       = true
  publicly_accessible     = false         # never exposed to internet
  deletion_protection     = false         # set true in real production
  skip_final_snapshot     = true          # set false in real production
  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"

  tags = { Name = "${var.project}-postgres" }
}