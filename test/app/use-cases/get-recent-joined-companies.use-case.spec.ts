import { GetRecentJoinedCompaniesUseCase } from '../../../src/application/use-cases/get-recent-joined-companies.use-case';
import { CompanyRepositoryPort } from '../../../src/domain/company.repository.port';
import { Company } from '../../../src/domain/company.entity';
import { CompanyType } from '../../../src/domain/company-type.enum';
import { randomUUID } from 'crypto';

describe('GetRecentJoinedCompaniesUseCase', () => {
  let mockRepository: jest.Mocked<CompanyRepositoryPort>;
  let useCase: GetRecentJoinedCompaniesUseCase;

  beforeEach(() => {
    mockRepository = {
      findRecentJoins: jest.fn(),
      findRecentTransfers: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    useCase = new GetRecentJoinedCompaniesUseCase(mockRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the companies provided by the repository', async () => {
    const company1 = new Company(randomUUID(), 'Company X', CompanyType.PYME, new Date());
    const company2 = new Company(randomUUID(), 'Company Y', CompanyType.CORPORATE, new Date());
    const mockCompanies: Company[] = [company1, company2];

    mockRepository.findRecentJoins.mockResolvedValue(mockCompanies);

    const result = await useCase.execute();

    expect(result).toEqual(mockCompanies);
    expect(result.length).toBe(2);
    expect(mockRepository.findRecentJoins).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array if the repository returns an empty array', async () => {
    mockRepository.findRecentJoins.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(mockRepository.findRecentJoins).toHaveBeenCalledTimes(1);
  });

});