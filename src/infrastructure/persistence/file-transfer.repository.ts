import { Transfer } from '../../domain/transfer.entity';
import { Company } from '../../domain/company.entity';
import { TransferRepositoryPort } from '../../domain/transfer.repository.port';
import { promises as fs } from 'fs';
import { join } from 'path';

interface Database {
  companies: Company[];
  transfers: Transfer[];
}

export class FileTransferRepository implements TransferRepositoryPort {
  private readonly dbPath = join(__dirname, '..', '..', 'db', 'database.json');

  private async readDb(): Promise<Database> {
    const raw = await fs.readFile(this.dbPath, 'utf-8');
    return JSON.parse(raw);
  }

  private async writeDb(data: Database): Promise<void> {
    await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async save(transfer: Transfer): Promise<void> {
    const db = await this.readDb();
    db.transfers.push(transfer);
    await this.writeDb(db);
  }
}
