import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '../common/enums/role.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto, userId: number) {
    return this.prisma.project.create({
      data: { ...dto, createdBy: userId },
    });
  }

  async findAll() {
    return this.prisma.project.findMany();
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(
    id: number,
    dto: UpdateProjectDto,
    user: { userId: number; role: Role },
  ) {
    const project = await this.findOne(id);
    // Only admin or creator can update
    if (user.role !== Role.ADMIN && project.createdBy !== user.userId) {
      throw new ForbiddenException('You cannot update this project');
    }
    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, user: { userId: number; role: Role }) {
    const project = await this.findOne(id);
    if (user.role !== Role.ADMIN && project.createdBy !== user.userId) {
      throw new ForbiddenException('You cannot delete this project');
    }
    return this.prisma.project.delete({ where: { id } });
  }
}
