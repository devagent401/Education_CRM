import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateInstitutionUseCase } from '../../application/institution/use-cases/create-institution.use-case';
import { ListInstitutionsUseCase } from '../../application/institution/use-cases/list-institutions.use-case';
import { GetInstitutionUseCase } from '../../application/institution/use-cases/get-institution.use-case';
import { UpdateInstitutionUseCase } from '../../application/institution/use-cases/update-institution.use-case';
import { DeleteInstitutionUseCase } from '../../application/institution/use-cases/delete-institution.use-case';
import { UpdateInstitutionDto, InstitutionQueryDto } from './dto/institution.dto';
import { Public } from '../../auth/decorators/public.decorator';

export class CreateInstitutionDto {
  @ApiProperty({ example: 'Demo School' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'DEMO001' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'demo-school' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'admin@demoschool.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Education Street' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'https://school.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'Logo URL' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Banner URL' })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional({ description: 'Footer text' })
  @IsOptional()
  @IsString()
  footerText?: string;

  @ApiPropertyOptional({ description: 'Tagline' })
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiPropertyOptional({ example: '#2563eb' })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiPropertyOptional({ example: '#64748b' })
  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @ApiPropertyOptional({ example: { facebook: 'url', twitter: 'url' } })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;
}

@ApiTags('institution')
@Controller('institution')
export class InstitutionController {
  constructor(
    private readonly createInstitutionUseCase: CreateInstitutionUseCase,
    private readonly listInstitutionsUseCase: ListInstitutionsUseCase,
    private readonly getInstitutionUseCase: GetInstitutionUseCase,
    private readonly updateInstitutionUseCase: UpdateInstitutionUseCase,
    private readonly deleteInstitutionUseCase: DeleteInstitutionUseCase,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create institution' })
  @ApiBody({ type: CreateInstitutionDto })
  @ApiResponse({ status: 201, description: 'Institution created' })
  @ApiResponse({ status: 409, description: 'Code or slug exists' })
  async create(@Body() dto: CreateInstitutionDto) {
    return this.createInstitutionUseCase.execute(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List institutions (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list' })
  async list(@Query() query: InstitutionQueryDto) {
    return this.listInstitutionsUseCase.execute({
      search: query.search,
      status: query.status as any,
      page: query.page,
      limit: query.limit,
    });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get institution by ID' })
  @ApiResponse({ status: 200, description: 'Institution found' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getById(@Param('id') id: string) {
    return this.getInstitutionUseCase.execute(id);
  }

  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Update institution' })
  @ApiBody({ type: UpdateInstitutionDto })
  @ApiResponse({ status: 200, description: 'Updated' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateInstitutionDto) {
    return this.updateInstitutionUseCase.execute(id, dto as any);
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete institution' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async delete(@Param('id') id: string) {
    return this.deleteInstitutionUseCase.execute(id);
  }
}
