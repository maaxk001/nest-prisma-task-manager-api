import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../common/enums/role.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskDto, user: { userId: number; role: Role }) {
    // anyone authenticated can create under a project
    return this.prisma.task.create({ data: { ...dto } });
  }

  async findAll(filter: any = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [tasks, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // newest first
      }),
      this.prisma.task.count({ where: filter }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async assign(taskId: number, assigneeId: number, user: { role: Role }) {
    if (user.role !== Role.MANAGER && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only managers or admins can assign tasks');
    }
    await this.findOne(taskId);
    return this.prisma.task.update({
      where: { id: taskId },
      data: { assigneeId },
    });
  }

  async update(
    id: number,
    dto: UpdateTaskDto,
    user: { userId: number; role: Role },
  ) {
    const task = await this.findOne(id);
    // allow if admin, or if user is assignee
    if (user.role !== Role.ADMIN && task.assigneeId !== user.userId) {
      throw new ForbiddenException('You cannot update this task');
    }
    return this.prisma.task.update({ where: { id }, data: dto });
  }

  async remove(id: number, user: { role: Role }) {
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admin can delete tasks');
    }
    return this.prisma.task.delete({ where: { id } });
  }
}
