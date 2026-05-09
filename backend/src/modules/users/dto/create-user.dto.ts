import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'doctor@mediflow.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: UserRole, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}