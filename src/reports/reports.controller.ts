import { Body, Controller, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate')
  async generate(@Body() dto: GenerateReportDto) {
    return this.reportsService.generate(dto);
  }
}
