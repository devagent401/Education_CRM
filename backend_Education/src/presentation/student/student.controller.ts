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
import { CreateStudentDto, UpdateStudentDto, StudentQueryDto } from './dto/student.dto';
import { CreateStudentUseCase } from '../../application/student/use-cases/create-student.use-case';
import { ListStudentsUseCase } from '../../application/student/use-cases/list-students.use-case';
import { GetStudentUseCase } from '../../application/student/use-cases/get-student.use-case';
import { UpdateStudentUseCase } from '../../application/student/use-cases/update-student.use-case';
import { DeleteStudentUseCase } from '../../application/student/use-cases/delete-student.use-case';
import { InstitutionGuard } from '../common/guards/institution.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('student')
@ApiSecurity('institution-id')
@Controller('student')
@UseGuards(JwtAuthGuard, InstitutionGuard)
export class StudentController {
  constructor(
    private readonly createStudentUseCase: CreateStudentUseCase,
    private readonly listStudentsUseCase: ListStudentsUseCase,
    private readonly getStudentUseCase: GetStudentUseCase,
    private readonly updateStudentUseCase: UpdateStudentUseCase,
    private readonly deleteStudentUseCase: DeleteStudentUseCase,
  ) {}

  private getInstitutionId(req: Request): string {
    return (req as Request & { institutionId: string }).institutionId;
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create student' })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({ status: 201, description: 'Student created' })
  @ApiResponse({ status: 409, description: 'Roll/Student ID exists' })
  async create(@Body() dto: CreateStudentDto, @Req() req: Request) {
    const institutionId = this.getInstitutionId(req);
    return this.createStudentUseCase.execute({
      institutionId,
      rollNumber: dto.rollNumber,
      studentId: dto.studentId,
      name: dto.name,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      gender: dto.gender,
      guardianId: dto.guardianId,
      classId: dto.classId,
      shift: dto.shift,
      batch: dto.batch,
    });
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List students (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list' })
  async list(@Query() query: StudentQueryDto, @Req() req: Request) {
    const institutionId = this.getInstitutionId(req);
    return this.listStudentsUseCase.execute(institutionId, {
      search: query.search,
      status: query.status as any,
      classId: query.classId,
      shift: query.shift,
      batch: query.batch,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiResponse({ status: 200, description: 'Student found' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getById(@Param('id') id: string) {
    return this.getStudentUseCase.execute(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update student' })
  @ApiBody({ type: UpdateStudentDto })
  @ApiResponse({ status: 200, description: 'Updated' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.dateOfBirth) data.dateOfBirth = new Date(dto.dateOfBirth);
    return this.updateStudentUseCase.execute(id, data as any);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete student' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async delete(@Param('id') id: string) {
    return this.deleteStudentUseCase.execute(id);
  }
}
