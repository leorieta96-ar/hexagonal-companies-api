import { Controller, Get, Post, Body } from '@nestjs/common';

import { RecordTransferUseCase } from '../../../application/use-cases/record-transfer.use-case';
import { FileCompanyRepository } from '../../persistence/file-company.repository';
import { RecordTransferDto } from './dto/record-transfer.dto';
import { FileTransferRepository } from '../../persistence/file-transfer.repository';

const repoCompany = new FileCompanyRepository();
const repoTransfer = new FileTransferRepository();

const recordTransferUseCase = new RecordTransferUseCase(repoTransfer, repoCompany);

@Controller('transfers')
export class TransferController {
  @Post('register')
  async recordTransfer(@Body() dto: RecordTransferDto) {
    await recordTransferUseCase.execute(dto);
    return { status: 'ok' };
  }
}
