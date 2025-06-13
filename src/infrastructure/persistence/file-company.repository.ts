import { Transfer } from '../../domain/transfer.entity';
import { Company } from '../../domain/company.entity';
import { CompanyRepositoryPort } from '../../domain/company.repository.port';
import { promises as fs } from 'fs';
import { join } from 'path';

interface Database {
  companies: Company[];
  transfers: Transfer[];
}

export class FileCompanyRepository implements CompanyRepositoryPort {
  private readonly dbPath = join(__dirname, '..', '..', 'db', 'database.json');

  private async readDb(): Promise<Database> {
    const raw = await fs.readFile(this.dbPath, 'utf-8');
    return JSON.parse(raw);
  }

  private async writeDb(data: Database): Promise<void> {
    await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async save(company: Company): Promise<void> {
    const db = await this.readDb();
    db.companies.push(company);
    await this.writeDb(db);
  }

  async findById(id: string): Promise<Company | null> {
    const db = await this.readDb();
    return db.companies.find((c) => c.id === id) ?? null;
  }

  async findRecentJoins(since: Date): Promise<Company[]> {
    const db = await this.readDb();
    return db.companies.filter((c) => new Date(c.joinedAt) > since);
  }

  async findRecentTransfers(since: Date): Promise<Company[]> {
    const db = await this.readDb();
    const companyIds = new Set(
      db.transfers
        .filter((t) => new Date(t.date) > since)
        .map((t) => t.companyId),
    );
    return db.companies.filter((c) => companyIds.has(c.id));
  }

}
