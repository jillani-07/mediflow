# MediFlow 🏥

> AWS-based Cloud & DevOps implementation project focused on infrastructure automation, CI/CD pipelines, containerized deployments, and cloud security best practices.

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![NestJS](https://img.shields.io/badge/NestJS-10-red?style=flat-square&logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-multi--stage-blue?style=flat-square&logo=docker)
![AWS](https://img.shields.io/badge/AWS-EC2·RDS·S3·ALB-orange?style=flat-square&logo=amazon-aws)
![Terraform](https://img.shields.io/badge/Terraform-IaC-purple?style=flat-square&logo=terraform)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-black?style=flat-square&logo=github-actions)

---

## Overview

MediFlow is a Healthtech platform for managing patients and appointments. Built to demonstrate end-to-end Cloud & DevOps ownership — infrastructure provisioning, containerization, CI/CD automation, and security hardening on AWS.

Every architectural decision reflects real-world engineering — private subnets, zero SSH access, secret management, image scanning, and fully automated deployments.

> **Live URL** — changes on each `terraform apply`. Run locally or redeploy using the guide below.

---

## Architecture

```mermaid
graph TB
    User(["User Browser"])

    subgraph CICD ["DevOps — GitHub"]
        GIT["GitHub Repository"]
        PIPE["GitHub Actions CI/CD\nTest → Build → Deploy → DB Sync"]
        TF["Terraform\nInfrastructure as Code"]
    end

    subgraph AWS ["AWS Cloud — ap-south-1"]

        subgraph Network ["VPC — 10.0.0.0/16"]

            subgraph Public ["Public Subnets"]
                ALB["ALB\nApplication Load Balancer"]
                subgraph EC2 ["EC2 — t3.micro"]
                    FE["Frontend\nReact + Nginx :80"]
                    BE["Backend\nNestJS :3001"]
                end
            end

            subgraph Private ["Private Subnets — no internet route"]
                RDS[("RDS PostgreSQL 16\nEncrypted · Private")]
            end
        end

        subgraph Services ["AWS Services"]
            ECR["ECR\nDocker Registry\nCVE Scan on push"]
            SM["Secrets Manager\nDB creds · JWT secret"]
            SSM["SSM Session Manager\nZero open ports"]
            CW["CloudWatch\nCPU Alarms · Logs"]
            S3["S3 Bucket\nAES-256 · Private\nConfig store"]
        end

        subgraph IAM ["IAM — Least Privilege"]
            ROLE["EC2 Role\nS3 + SSM + Secrets + ECR"]
        end
    end

    User -->|HTTP| ALB
    ALB -->|/* | FE
    ALB -->|/api/*| BE
    BE --> RDS
    BE --> SM
    BE --> S3
    EC2 --- ROLE
    SSM -->|no SSH| EC2

    GIT -->|git push triggers| PIPE
    PIPE -->|docker push| ECR
    PIPE -->|s3 cp compose file| S3
    PIPE -->|ssm send-command| EC2
    ECR -->|docker pull| EC2
    TF -->|terraform apply| AWS
    EC2 --> CW
```

---

## CI/CD Pipeline

```mermaid
flowchart LR
    DEV["Developer\nMacBook"] -->|git push main| GH["GitHub"]
    GH --> TEST

    subgraph PIPELINE ["GitHub Actions Pipeline — ~4 minutes"]
        TEST["TEST\nnpm build\nlint + type check"] --> BUILD
        BUILD["BUILD\ndocker build\nmulti-stage"] --> PUSH
        PUSH["PUSH\nAWS ECR\nCVE scan"] --> DEPLOY
        DEPLOY["DEPLOY\nS3 → EC2\nSSM send-command"] --> DBSYNC
        DBSYNC["DB SYNC\nauto table creation\nfresh deploy safe"]
    end

    DBSYNC -->|live| PROD["AWS EC2\nap-south-1"]

    style TEST fill:#4A90D9,color:#fff
    style BUILD fill:#7B68EE,color:#fff
    style PUSH fill:#20B2AA,color:#fff
    style DEPLOY fill:#3CB371,color:#fff
    style DBSYNC fill:#E8782A,color:#fff
    style PROD fill:#E8782A,color:#fff
```

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS | Fast UI, type-safe |
| Backend | NestJS, TypeORM | Modular, decorator-based REST API |
| Database | PostgreSQL 16 | UUID, relational, production-grade |
| Auth | JWT 8h expiry, bcrypt 12 rounds | Stateless, secure password hashing |
| Containers | Docker multi-stage builds | Small images, no dev deps in prod |
| Registry | AWS ECR | Private, CVE scan on every push |
| Deployment | AWS EC2 + docker-compose | Full control, Dockerized |
| Load Balancer | AWS ALB | Health checks, /api/* routing |
| Database hosting | AWS RDS | Managed, encrypted, private subnet |
| Secrets | AWS Secrets Manager | Zero plaintext credentials |
| Server access | AWS SSM | No SSH, IAM-controlled, audited |
| IaC | Terraform — modular | Reproducible, versioned infra |
| CI/CD | GitHub Actions | Automated test → build → deploy |
| Monitoring | CloudWatch | CPU alarms, 7-day log retention |
| File storage | S3 | Private, AES-256, versioned, config store |

---

## Security

```mermaid
graph TB
    subgraph NEVER ["❌ Never"]
        ENV[".env files in Git"]
        PWD["Hardcoded passwords"]
        SSH["Port 22 open"]
        PUB["RDS public access"]
    end

    subgraph ALWAYS ["✅ Always"]
        SM["AWS Secrets Manager\nEncrypted · IAM controlled · Audited"]
        SSM["AWS SSM Session Manager\nZero open ports · Full audit log"]
        PRIV["RDS in private subnet\nNo internet route — EC2 only"]
        IAM["IAM Least Privilege\nEC2 scoped to S3 + SSM + Secrets + ECR"]
    end

    ENV -->|stored here| SM
    PWD -->|stored here| SM
    SSH -->|replaced by| SSM
    PUB -->|replaced by| PRIV

    style NEVER fill:#FFE4E4,color:#CC0000
    style ALWAYS fill:#E4FFE4,color:#006600
```

**Additional hardening:**
- EBS gp3 encrypted at rest
- RDS storage encrypted
- S3 AES-256 + versioning + public access blocked
- ECR CVE vulnerability scan on every image push
- API rate limiting — 100 req/min per IP
- HTTP security headers via Helmet
- JWT authentication on all protected routes

---

## Infrastructure — Terraform

All AWS resources provisioned via Terraform. Zero manual console clicks.
infrastructure/
└── modules/
├── vpc/   → VPC, public/private subnets, IGW, route tables
├── ec2/   → EC2, IAM role, instance profile, security groups
├── rds/   → PostgreSQL 16, private subnet, encrypted
├── s3/    → Private bucket, AES-256, versioning, config store
└── alb/   → ALB, target groups, /api/* listener rules

**Security group chain — least privilege:**
Internet → ALB SG (80/443)
↓
EC2 SG (from ALB SG only)
↓
RDS SG (5432 from EC2 SG only)
---

## Screenshots

> Login Page

![Login](docs/screenshots/login.png)

> Dashboard — live data from RDS

![Dashboard](docs/screenshots/dashboard.png)

> Patients

![Patients](docs/screenshots/patients.png)

> GitHub Actions — CI/CD Pipeline

![Pipeline](docs/screenshots/pipeline.png)

> AWS EC2 Console

![EC2](docs/screenshots/ec2-console.png)

---

## Local Development

**Prerequisites:** Docker Desktop, Node.js 20+

```bash
git clone https://github.com/jillani-07/mediflow.git
cd mediflow

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# fill in values

docker-compose up
```

Tables are created automatically on first run (`NODE_ENV=development`).

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api/v1 |
| Swagger docs | http://localhost:3001/api/docs |

---

## Fresh AWS Deployment Guide

```bash
# 1. Configure AWS CLI
aws configure --profile mediflow

# 2. Create ECR repos
aws ecr create-repository --repository-name mediflow/backend --region ap-south-1 --profile mediflow
aws ecr create-repository --repository-name mediflow/frontend --region ap-south-1 --profile mediflow

# 3. Provision infrastructure
cd infrastructure
export TF_VAR_db_password="YOUR_DB_PASSWORD"
terraform init && terraform apply

# 4. Create .env on EC2 via SSM
aws ssm send-command --instance-id "<INSTANCE_ID>" \
  --document-name "AWS-RunShellScript" \
  --parameters 'commands=["mkdir -p /home/ec2-user/mediflow && printf \"DB_HOST=<RDS_ENDPOINT>\nDB_PASSWORD=<PASSWORD>\nAPP_SECRET=<SECRET>\nAWS_ACCOUNT_ID=<ACCOUNT_ID>\nAWS_REGION=ap-south-1\n\" > /home/ec2-user/mediflow/.env"]' \
  --region ap-south-1 --profile mediflow

# 5. Add GitHub Secrets
# AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
# AWS_ACCOUNT_ID, EC2_HOST, ALB_DNS

# 6. Trigger pipeline
git commit --allow-empty -m "chore: trigger deployment"
git push origin main
```

---

## Project Structure
mediflow/
├── frontend/              # React + TypeScript + Tailwind
├── backend/               # NestJS + TypeORM
│   └── src/
│       ├── modules/       # auth, users, patients, appointments
│       ├── common/        # guards, filters, interceptors
│       └── config/        # app, database config
├── infrastructure/        # Terraform
│   └── modules/           # vpc, ec2, rds, s3, alb
├── .github/workflows/     # GitHub Actions CI/CD
├── docker-compose.yml     # Local development
└── docker-compose.prod.yml # Production — pulled from S3 on deploy
---

## Roadmap

- [x] Terraform IaC — all AWS resources as code
- [x] GitHub Actions CI/CD — automated pipeline
- [x] Docker multi-stage builds
- [x] Zero SSH — SSM Session Manager
- [x] RDS in private subnet
- [x] AWS Secrets Manager
- [x] CloudWatch monitoring + alarms
- [x] ALB with path-based routing
- [x] S3 as config store for docker-compose
- [x] ECR CVE scanning
- [ ] Patient registration + appointment scheduling forms
- [ ] HTTPS — ACM certificate with custom domain
- [ ] Auto Scaling Group — scale on CPU threshold
- [ ] S3 file upload — patient document storage
- [ ] CloudWatch dashboard — metrics visualization
- [ ] Terraform remote state — S3 backend

---

## Author

**Jillani Ansari** — Cloud & DevOps Engineer

[LinkedIn](https://linkedin.com/in/jillani05) · [GitHub](https://github.com/jillani-07)