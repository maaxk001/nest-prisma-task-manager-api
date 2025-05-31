// src/projects/projects.controller.ts
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
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { GetUser } from '../common/decorators/user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { RolesGuard } from 'src/auth/roles.gaurd';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  create(@Body() dto: CreateProjectDto, @GetUser() user: { userId: number }) {
    return this.projectsService.create(dto, user.userId);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
    @GetUser() user: { userId: number; role: Role },
  ) {
    return this.projectsService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN) // only ADMIN can delete all; creators also allowed in service
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: { userId: number; role: Role },
  ) {
    return this.projectsService.remove(id, user);
  }
}
