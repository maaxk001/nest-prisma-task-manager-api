import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { GetUser } from '../common/decorators/user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RolesGuard } from 'src/auth/roles.gaurd';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(
    @Body() dto: CreateTaskDto,
    @GetUser() user: { userId: number; role: Role },
  ) {
    return this.tasksService.create(dto, user);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: number,
    @Query('assigneeId') assigneeId?: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (priority) filters.priority = Number(priority);
    if (assigneeId) filters.assigneeId = Number(assigneeId);

    return this.tasksService.findAll(filters, Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id/assign')
  @Roles(Role.MANAGER, Role.ADMIN)
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body('assigneeId', ParseIntPipe) assigneeId: number,
    @GetUser() user: { role: Role },
  ) {
    return this.tasksService.assign(id, assigneeId, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @GetUser() user: { userId: number; role: Role },
  ) {
    return this.tasksService.update(id, dto, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: { role: Role },
  ) {
    return this.tasksService.remove(id, user);
  }
}
