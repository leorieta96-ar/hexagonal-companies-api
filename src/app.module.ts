import { Module } from '@nestjs/common';
import { CompanyController } from './infrastructure/http/company/company.controller';
import { TransferController } from './infrastructure/http/transfer/transfer.controller';

@Module({
  controllers: [CompanyController, TransferController],
})
export class AppModule {}
