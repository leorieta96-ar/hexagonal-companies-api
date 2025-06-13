import { Transfer } from './transfer.entity';

export interface TransferRepositoryPort {
  save(transfer: Transfer): Promise<void>;
}
