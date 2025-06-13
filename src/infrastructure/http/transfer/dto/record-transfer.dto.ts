import { IsUUID } from 'class-validator';

export class RecordTransferDto {
  @IsUUID()
  companyId: string;
}
