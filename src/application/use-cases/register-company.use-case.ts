import { Company } from '../../domain/company.entity';
import { CompanyType } from '../../domain/company-type.enum';
import { CompanyRepositoryPort } from '../../domain/company.repository.port';
import { randomUUID } from 'crypto';

interface Input {
  name: string;
  type: CompanyType;
}

export class RegisterCompanyUseCase {
  constructor(private readonly repository: CompanyRepositoryPort) {}

  async execute(input: Input): Promise<void> {
    const company = new Company(randomUUID(), input.name, input.type, new Date());
    await this.repository.save(company);
  }
}
