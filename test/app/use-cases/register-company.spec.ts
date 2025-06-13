import { RegisterCompanyUseCase } from '../../../src/application/use-cases/register-company.use-case';
import { FileCompanyRepository } from '../../../src/infrastructure/persistence/file-company.repository';
import { CompanyType } from '../../../src/domain/company-type.enum';

describe('RegisterCompanyUseCase', () => {
  it('should register a new company', async () => {
    const repo = new FileCompanyRepository();
    const useCase = new RegisterCompanyUseCase(repo);

    await useCase.execute({ name: 'TestCorp', type: CompanyType.CORPORATE });

    const joined = await repo.findRecentJoins(new Date(Date.now() - 10000));
    expect(joined.length).toBe(1);
    expect(joined[0].name).toBe('TestCorp');
  });
});
