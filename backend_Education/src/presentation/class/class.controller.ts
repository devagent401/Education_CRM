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
import { CreateClassDto, UpdateClassDto, ClassQueryDto } from './dto/class.dto';
import { CreateClassUseCase } from '../../application/class/use-cases/create-class.use-case';
import { ListClassesUseCase } from '../../application/class/use-cases/list-classes.use-case';
import { GetClassUseCase } from '../../application/class/use-cases/get-class.use-case';
import { UpdateClassUseCase } from '../../application/class/use-cases/update-class.use-case';
import { DeleteClassUseCase } from '../../application/class/use-cases/delete-class.use-case';
import { InstitutionGuard } from '../common/guards/institution.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('class')
@ApiSecurity('institution-id')
@Controller('class')
@UseGuards(JwtAuthGuard, InstitutionGuard)
export class ClassController {
  constructor(
    private readonly createClassUseCase: CreateClassUseCase,
    private readonly listClassesUseCase: ListClassesUseCase,
    private readonly getClassUseCase: GetClassUseCase,
    private readonly updateClassUseCase: UpdateClassUseCase,
    private readonly deleteClassUseCase: DeleteClassUseCase,
  ) {}

  private getInstitutionId(req: Request): string {
    return (req as Request & { institutionId: string }).institutionId;
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create class/section/shift' })
  @ApiBody({ type: CreateClassDto })
  @ApiResponse({ status: 201, description: 'Created' })
  async create(@Body() dto: CreateClassDto, @Req() req: Request) {
    const institutionId = this.getInstitutionId(req);
    return this.createClassUseCase.execute({
      institutionId,
      name: dto.name,
      code: dto.code,
      level: dto.level,
      parentId: dto.parentId,
      sortOrder: dto.sortOrder,
    });
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List classes (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list' })
  async list(@Query() query: ClassQueryDto, @Req() req: Request) {
    const institutionId = this.getInstitutionId(req);
    return this.listClassesUseCase.execute(institutionId, {
      level: query.level,
      parentId: query.parentId,
      search: query.search,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get class by ID' })
  @ApiResponse({ status: 200 })
  async getById(@Param('id') id: string) {
    return this.getClassUseCase.execute(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update class' })
  @ApiBody({ type: UpdateClassDto })
  @ApiResponse({ status: 200 })
  async update(@Param('id') id: string, @Body() dto: UpdateClassDto) {
    return this.updateClassUseCase.execute(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete class' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string) {
    return this.deleteClassUseCase.execute(id);
  }
}
