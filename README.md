# MediFlow 🏥

Production-grade Healthtech platform built to demonstrate Cloud & DevOps engineering.

## Tech Stack
- **Frontend** — React + TypeScript + Tailwind CSS
- **Backend** — NestJS + PostgreSQL (TypeORM)
- **Cloud** — AWS (EC2, RDS, S3, ECR, IAM, SSM, Secrets Manager, CloudWatch)
- **DevOps** — Docker, GitHub Actions CI/CD, Terraform (IaC)

## Architecture
- VPC with public/private subnets
- EC2 (t3.micro) running Docker containers
- RDS PostgreSQL in private subnet — no internet access
- S3 for file storage — private, AES-256 encrypted
- ECR for Docker image registry — CVE scan on push
- SSM Session Manager — zero open ports, no SSH
- Secrets Manager — no plaintext secrets anywhere
- CloudWatch — CPU alerts, log retention

## CI/CD Pipeline
Every `git push` to `main`:
1. Test — lint + build both apps
2. Build — docker build + push to ECR
3. Deploy — SSM command to EC2, docker-compose up

## Security
- No port 22 open — SSM only
- RDS in private subnet — EC2 access only
- IAM least privilege — EC2 role scoped to S3 + SSM + Secrets
- EBS encrypted, RDS encrypted at rest
- ECR image scanning on every push
- Rate limiting + Helmet on API

## Local Setup
1. Clone repo
2. Copy `.env.example` to `.env` in frontend/ and backend/
3. Fill values
4. Run `docker-compose up`

## Status
- [x] Phase 1 — Git + Security baseline
- [x] Phase 2 — NestJS Backend
- [x] Phase 3 — React Frontend
- [x] Phase 4 — Docker
- [x] Phase 5 — Terraform IaC
- [x] Phase 6 — GitHub Actions CI/CD
- [x] Phase 7 — AWS Deployment
- [x] Phase 8 — Secrets Manager
- [x] Phase 9 — CloudWatch Monitoring