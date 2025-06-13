import { Company } from './company.entity';

export interface CompanyRepositoryPort {
  findRecentTransfers(since: Date): Promise<Company[]>;
  findRecentJoins(since: Date): Promise<Company[]>;
  findById(id: string): Promise<Company | null>;
  save(company: Company): Promise<void>;
}
