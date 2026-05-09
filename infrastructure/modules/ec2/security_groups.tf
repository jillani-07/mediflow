# ── ALB Security Group ────────────────────────────────────
# Allows HTTP/HTTPS from internet
resource "aws_security_group" "alb" {
  name        = "${var.project}-alb-sg"
  description = "ALB — allow HTTP and HTTPS from internet"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project}-alb-sg" }
}

# ── EC2 Security Group ────────────────────────────────────
# Only accepts traffic FROM ALB — not directly from internet
resource "aws_security_group" "ec2" {
  name        = "${var.project}-ec2-sg"
  description = "EC2 — allow traffic from ALB only"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Frontend from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description     = "Backend API from ALB"
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description = "SSH — restrict to your IP only"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${var.allowed_ssh_cidr}"]   # your IP — not 0.0.0.0/0
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project}-ec2-sg" }
}

# ── RDS Security Group ────────────────────────────────────
# Only accepts traffic FROM EC2 — never from internet
resource "aws_security_group" "rds" {
  name        = "${var.project}-rds-sg"
  description = "RDS — allow PostgreSQL from EC2 only"
  vpc_id      = var.vpc_id

  ingress {
    description     = "PostgreSQL from EC2"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project}-rds-sg" }
}