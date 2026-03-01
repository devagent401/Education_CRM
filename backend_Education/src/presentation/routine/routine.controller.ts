import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CreateRoutineDto, UpdateRoutineDto, RoutineQueryDto } from './dto/routine.dto';
import { CreateRoutineUseCase } from '../../application/routine/use-cases/create-routine.use-case';
import { ListRoutinesUseCase } from '../../application/routine/use-cases/list-routines.use-case';
import { GetRoutineUseCase } from '../../application/routine/use-cases/get-routine.use-case';
import { UpdateRoutineUseCase } from '../../application/routine/use-cases/update-routine.use-case';
import { DeleteRoutineUseCase } from '../../application/routine/use-cases/delete-routine.use-case';
import { InstitutionGuard } from '../common/guards/institution.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('routine')
@ApiSecurity('institution-id')
@Controller('routine')
@UseGuards(JwtAuthGuard, InstitutionGuard)
export class RoutineController {
  constructor(
    private readonly createRoutineUseCase: CreateRoutineUseCase,
    private readonly listRoutinesUseCase: ListRoutinesUseCase,
    private readonly getRoutineUseCase: GetRoutineUseCase,
    private readonly updateRoutineUseCase: UpdateRoutineUseCase,
    private readonly deleteRoutineUseCase: DeleteRoutineUseCase,
  ) {}

  private getInstitutionId(req: Request): string {
    return (req as Request & { institutionId: string }).institutionId;
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create class routine' })
  @ApiBody({ type: CreateRoutineDto })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateRoutineDto, @Req() req: Request) {
    const institutionId = this.getInstitutionId(req);
    return this.createRoutineUseCase.execute({
      institutionId,
      classId: dto.classId,
      subjectName: dto.subjectName,
      subjectId: dto.subjectId,
      teacherId: dto.teacherId,
      teacherProfileId: dto.teacherProfileId,
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
      room: dto.room,
      academicYear: dto.academicYear,
    });
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List routines (paginated)' })
  @ApiResponse({ status: 200 })
  async list(@Query() query: RoutineQueryDto, @Req() req: Request) {
    const institutionId = this.getInstitutionId(req);
    return this.listRoutinesUseCase.execute(institutionId, {
      classId: query.classId,
      teacherId: query.teacherId,
      dayOfWeek: query.dayOfWeek,
      academicYear: query.academicYear,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get routine by ID' })
  @ApiResponse({ status: 200 })
  async getById(@Param('id') id: string) {
    return this.getRoutineUseCase.execute(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update routine' })
  @ApiBody({ type: UpdateRoutineDto })
  @ApiResponse({ status: 200 })
  async update(@Param('id') id: string, @Body() dto: UpdateRoutineDto) {
    return this.updateRoutineUseCase.execute(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete routine' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string) {
    return this.deleteRoutineUseCase.execute(id);
  }
}
