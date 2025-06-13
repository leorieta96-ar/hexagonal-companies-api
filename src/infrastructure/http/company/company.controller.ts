import { Controller, Get, Post, Body } from '@nestjs/common';

import { RegisterCompanyUseCase } from '../../../application/use-cases/register-company.use-case';
import { GetRecentJoinedCompaniesUseCase } from '../../../application/use-cases/get-recent-joined-companies.use-case';
import { GetRecentTransferCompaniesUseCase } from '../../../application/use-cases/get-recent-transfer-companies.use-case';
import { FileCompanyRepository } from '../../persistence/file-company.repository';
import { RegisterCompanyDto } from './dto/register-company.dto';

const repo = new FileCompanyRepository();

const registerUseCase = new RegisterCompanyUseCase(repo);
const joinedUseCase = new GetRecentJoinedCompaniesUseCase(repo);
const transferUseCase = new GetRecentTransferCompaniesUseCase(repo);

@Controller('companies')
export class CompanyController {
  @Post('register')
  async register(@Body() dto: RegisterCompanyDto) {
    await registerUseCase.execute(dto);
    return { status: 'ok' };
  }

  @Get('joined-last-month')
  async getJoined() {
    return joinedUseCase.execute();
  }

  @Get('transferred-last-month')
  async getTransfers() {
    return transferUseCase.execute();
  }


}
