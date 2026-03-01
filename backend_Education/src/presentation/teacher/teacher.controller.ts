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
import { CreateTeacherDto, UpdateTeacherDto, TeacherQueryDto } from './dto/teacher.dto';
import { CreateTeacherUseCase } from '../../application/teacher/use-cases/create-teacher.use-case';
import { ListTeachersUseCase } from '../../application/teacher/use-cases/list-teachers.use-case';
import { GetTeacherUseCase } from '../../application/teacher/use-cases/get-teacher.use-case';
import { UpdateTeacherUseCase } from '../../application/teacher/use-cases/update-teacher.use-case';
import { DeleteTeacherUseCase } from '../../application/teacher/use-cases/delete-teacher.use-case';
import { InstitutionGuard } from '../common/guards/institution.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('teacher')
@ApiSecurity('institution-id')
@Controller('teacher')
@UseGuards(JwtAuthGuard, InstitutionGuard)
export class TeacherController {
  constructor(
    private readonly createTeacherUseCase: CreateTeacherUseCase,
    private readonly listTeachersUseCase: ListTeachersUseCase,
    private readonly getTeacherUseCase: GetTeacherUseCase,
    private readonly updateTeacherUseCase: UpdateTeacherUseCase,
    private readonly deleteTeacherUseCase: DeleteTeacherUseCase,
  ) {}

  private getInstitutionId(req: Request): string {
    return (req as Request & { institutionId: string }).institutionId;
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create teacher' })
  @ApiBody({ type: CreateTeacherDto })
  @ApiResponse({ status: 201, description: 'Teacher created' })
  async create(@Body() dto: CreateTeacherDto, @Req() req: Request) {
    const institutionId = this.getInstitutionId(req);
    return this.createTeacherUseCase.execute({
      institutionId,
      email: dto.email,
      password: dto.password,
      name: dto.name,
      phone: dto.phone,
      employeeId: dto.employeeId,
      department: dto.department,
      specialization: dto.specialization,
      salary: dto.salary,
      joinDate: dto.joinDate ? new Date(dto.joinDate) : undefined,
    });
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List teachers (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list' })
  async list(@Query() query: TeacherQueryDto, @Req() req: Request) {
    const institutionId = this.getInstitutionId(req);
    return this.listTeachersUseCase.execute(institutionId, {
      search: query.search,
      department: query.department,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get teacher by ID' })
  @ApiResponse({ status: 200, description: 'Teacher found' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getById(@Param('id') id: string) {
    return this.getTeacherUseCase.execute(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update teacher' })
  @ApiBody({ type: UpdateTeacherDto })
  @ApiResponse({ status: 200, description: 'Updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.joinDate) data.joinDate = new Date(dto.joinDate);
    return this.updateTeacherUseCase.execute(id, data as any);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete teacher' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  async delete(@Param('id') id: string) {
    return this.deleteTeacherUseCase.execute(id);
  }
}
