import {
  Injectable, NotFoundException, ConflictException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { User } from '../users/user.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
  ) {}

  async create(dto: CreatePatientDto, createdBy: User): Promise<Patient> {
    const existing = await this.patientsRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Patient email already registered');

    const patient = this.patientsRepository.create({ ...dto, createdBy });
    const saved = await this.patientsRepository.save(patient);

    if (saved.createdBy) {
      delete (saved.createdBy as any).password;
    }
    return saved;
  }

  async findAll(page = 1, limit = 10): Promise<{ data: Patient[]; total: number }> {
    const [data, total] = await this.patientsRepository.findAndCount({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['createdBy'],
    });

    data.forEach((p) => {
      if (p.createdBy) delete (p.createdBy as any).password;
    });

    return { data, total };
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { id, isActive: true },
      relations: ['createdBy'],
    });
    if (!patient) throw new NotFoundException(`Patient ${id} not found`);

    if (patient.createdBy) {
      delete (patient.createdBy as any).password;
    }
    return patient;
  }

  async update(id: string, dto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    Object.assign(patient, dto);
    const saved = await this.patientsRepository.save(patient);

    if (saved.createdBy) {
      delete (saved.createdBy as any).password;
    }
    return saved;
  }

  async remove(id: string): Promise<{ message: string }> {
    const patient = await this.findOne(id);
    patient.isActive = false;
    await this.patientsRepository.save(patient);
    return { message: `Patient ${id} deactivated` };
  }
}