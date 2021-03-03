import Appointment from '../infra/typeorm/entities/Appointment';

import ICreateAppointmentDTO from '../dto/ICreateAppointmentDTO';

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
