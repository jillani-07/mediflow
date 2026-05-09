output "instance_id"        { value = aws_instance.app.id }
output "public_ip"          { value = aws_instance.app.public_ip }
output "ec2_sg_id"          { value = aws_security_group.ec2.id }
output "alb_sg_id"          { value = aws_security_group.alb.id }
output "rds_sg_id"          { value = aws_security_group.rds.id }