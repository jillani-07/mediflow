# MediFlow 🏥

A production-style Healthtech platform built to demonstrate real-world **Cloud & DevOps engineering** — not just code, but the full lifecycle: infrastructure, containerization, CI/CD, security, and monitoring.

> **Focus:** Cloud & DevOps (AWS + Docker + Terraform + GitHub Actions)  
> **Status:** Live on AWS — actively adding features

---

## Live Demo
**URL:** http://mediflow-alb-669746895.ap-south-1.elb.amazonaws.com

**Test credentials:**
- Email: `admin@mediflow.com`
- Password: `Admin1234`

---

## Architecture
User → ALB → EC2 (Docker)
├── Frontend (React + Nginx)
└── Backend (NestJS)
└── RDS PostgreSQL (private subnet)
└── S3 (file storage)

![Dashboard](docs/screenshots/dashboard.png)

---

## Tech Stack

### Application
| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL (AWS RDS) |
| Auth | JWT + bcrypt |

### Cloud & DevOps
| Area | Technology |
|---|---|
| Cloud | AWS (EC2, RDS, S3, ECR, ALB, IAM, SSM, Secrets Manager, CloudWatch) |
| IaC | Terraform |
| Containers | Docker, multi-stage builds |
| CI/CD | GitHub Actions |
| Monitoring | CloudWatch alarms + log retention |

---

## AWS Infrastructure

VPC (10.0.0.0/16)
├── Public Subnets  → EC2, ALB
└── Private Subnets → RDS PostgreSQL
Security Groups
├── ALB SG  → accepts 80/443 from internet
├── EC2 SG  → accepts traffic from ALB only
└── RDS SG  → accepts 5432 from EC2 only

### Key Security Decisions
- **No port 22** — EC2 access via AWS SSM only
- **RDS in private subnet** — never exposed to internet
- **IAM least privilege** — EC2 role scoped to S3 + SSM + Secrets Manager
- **Secrets Manager** — no plaintext credentials anywhere
- **EBS + RDS encrypted** at rest
- **ECR image scanning** — CVE check on every push

---

## CI/CD Pipeline

Every `git push` to `main` triggers:

Test (1m)  →  Build & Push to ECR (3m)  →  Deploy via SSM (30s)
- **Test** — TypeScript build + lint check
- **Build** — Multi-stage Docker build, push to AWS ECR with CVE scan
- **Deploy** — SSM `send-command` to EC2, zero SSH, zero downtime

![Pipeline](docs/screenshots/pipeline.png)

---

## Local Development

### Prerequisites
- Docker Desktop
- Node.js 20+

### Setup

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/mediflow.git
cd mediflow

# Backend
cd backend
cp .env.example .env
# fill in values
npm install
npm run start:dev

# Frontend
cd frontend
cp .env.example .env
npm install
npm start

# Or run everything with Docker
docker-compose up
```

---

## Project Structure
mediflow/
├── frontend/              # React + TypeScript
├── backend/               # NestJS + TypeORM
├── infrastructure/        # Terraform (AWS IaC)
│   └── modules/
│       ├── vpc/
│       ├── ec2/
│       ├── rds/
│       ├── s3/
│       └── alb/
├── .github/
│   └── workflows/
│       └── deploy.yml     # CI/CD pipeline
└── docker-compose.yml     # Local dev
---

## Roadmap
- [ ] Patient registration form
- [ ] Appointment scheduling form
- [ ] HTTPS with custom domain (ACM)
- [ ] Auto Scaling Group (ASG)
- [ ] S3 file upload (patient reports)
- [ ] CloudWatch dashboard

---

## What I Learned
- Provisioning production-style AWS infrastructure with Terraform
- Multi-stage Docker builds for optimized images
- Zero-trust access — SSM instead of SSH
- GitHub Actions CI/CD with ECR integration
- IAM least privilege in practice
- Debugging real AWS errors (RDS SSL, security groups, ECR auth)