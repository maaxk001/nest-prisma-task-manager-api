import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  priority?: number;
}
