import { Transfer } from '../../domain/transfer.entity';
import { CompanyRepositoryPort } from '../../domain/company.repository.port';
import { randomUUID } from 'crypto';
import { Logger, NotFoundException } from '@nestjs/common';
import { TransferRepositoryPort } from 'src/domain/transfer.repository.port';

interface Input {
  companyId: string;
}

export class RecordTransferUseCase {
  constructor(private readonly repositoryTranfer: TransferRepositoryPort, private readonly repository: CompanyRepositoryPort) {}

  async execute(input: Input): Promise<void> {
    const company = await this.repository.findById(input.companyId);
    if (!company) {
      Logger.error('Empresa no encontrada al registrar transferencia');
      throw new NotFoundException('Company not found');
    }
    const transfer = new Transfer(randomUUID(), input.companyId, new Date());
    await this.repositoryTranfer.save(transfer);
  }
}
