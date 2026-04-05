# SilverBank AWS

Production-grade cloud deployment of SilverBank on AWS.

## Architecture
- **Frontend:** Next.js (port 3000)
- **Backend:** Express.js (port 4000)
- **Database:** RDS PostgreSQL Multi-AZ
- **Compute:** EC2 + Auto Scaling Groups
- **Load Balancer:** ALB with Blue/Green deployment
- **Registry:** ECR
- **Monitoring:** CloudWatch + SNS alerts

## Deployment Strategy
Blue/Green with cost-optimised standby:
- Active color: 2 instances
- Idle color: 1 instance (warm standby)
- Traffic switch via ALB listener
- 10-minute monitoring window with auto-rollback
- Manual rollback available at any time

## Infrastructure
See [DevOps-final-project](https://github.com/mariusiordan/DevOps-final-project) for Terraform and Ansible.
# Pipeline 1 test
