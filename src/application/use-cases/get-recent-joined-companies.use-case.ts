import { CompanyRepositoryPort } from '../../domain/company.repository.port';

export class GetRecentJoinedCompaniesUseCase {
  constructor(private readonly repository: CompanyRepositoryPort) {}

  async execute(): Promise<any[]> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.repository.findRecentJoins(oneMonthAgo);
  }
}
