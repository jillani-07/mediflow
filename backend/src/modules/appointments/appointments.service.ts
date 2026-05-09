import {
  Injectable, NotFoundException, BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
  ) {}

  async create(dto: CreateAppointmentDto, createdBy: User): Promise<Appointment> {
    const conflict = await this.appointmentsRepository
      .createQueryBuilder('a')
      .where('a.doctorId = :doctorId', { doctorId: dto.doctorId })
      .andWhere('a.scheduledAt = :scheduledAt', { scheduledAt: dto.scheduledAt })
      .andWhere('a.status NOT IN (:...statuses)', {
        statuses: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
      })
      .getOne();

    if (conflict) {
      throw new BadRequestException('Doctor already has an appointment at this time');
    }

    const appointment = this.appointmentsRepository.create({
      patient: { id: dto.patientId } as any,
      doctor: { id: dto.doctorId } as any,
      scheduledAt: new Date(dto.scheduledAt),
      duration: dto.duration ?? 30,
      status: dto.status ?? AppointmentStatus.SCHEDULED,
      notes: dto.notes,
      createdBy,
    });

    return this.appointmentsRepository.save(appointment);
  }

  async findAll(
    page = 1,
    limit = 10,
    status?: AppointmentStatus,
  ): Promise<{ data: Appointment[]; total: number }> {
    const query = this.appointmentsRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.patient', 'patient')
      .leftJoinAndSelect('a.doctor', 'doctor')
      .orderBy('a.scheduledAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (status) query.where('a.status = :status', { status });

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor', 'createdBy'],
    });
    if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
    return appointment;
  }

  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, dto);
    return this.appointmentsRepository.save(appointment);
  }

  async cancel(id: string): Promise<{ message: string }> {
    const appointment = await this.findOne(id);
    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed appointment');
    }
    appointment.status = AppointmentStatus.CANCELLED;
    await this.appointmentsRepository.save(appointment);
    return { message: `Appointment ${id} cancelled` };
  }
}