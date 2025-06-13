import { GetRecentTransferCompaniesUseCase } from '../../../src/application/use-cases/get-recent-transfer-companies.use-case';
import { CompanyRepositoryPort } from '../../../src/domain/company.repository.port';
import { Company } from '../../../src/domain/company.entity';
import { CompanyType } from '../../../src/domain/company-type.enum';
import { randomUUID } from 'crypto';
import { FileCompanyRepository } from '../../../src/infrastructure/persistence/file-company.repository';
import { FileTransferRepository } from '../../../src/infrastructure/persistence/file-transfer.repository';
import { RecordTransferUseCase } from '../../../src/application/use-cases/record-transfer.use-case';

describe('GetRecentTransferCompaniesUseCase', () => {
  let mockRepository: jest.Mocked<CompanyRepositoryPort>;
  let useCase: GetRecentTransferCompaniesUseCase;

  beforeEach(() => {
    mockRepository = {
      findRecentTransfers: jest.fn(),
      findRecentJoins: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    useCase = new GetRecentTransferCompaniesUseCase(mockRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the companies with recent transfers provided by the repository', async () => {
    const company1 = new Company(
      randomUUID(),
      'Transfer Corp A',
      CompanyType.CORPORATE,
      new Date(),
    );
    const company2 = new Company(
      randomUUID(),
      'Transfer Corp B',
      CompanyType.PYME,
      new Date(),
    );
    const mockCompanies: Company[] = [company1, company2];

    mockRepository.findRecentTransfers.mockResolvedValue(mockCompanies);

    const result = await useCase.execute();

    expect(result).toEqual(mockCompanies);
    expect(result.length).toBe(2);
    expect(mockRepository.findRecentTransfers).toHaveBeenCalledTimes(1);

    expect(mockRepository.findRecentTransfers).toHaveBeenCalledWith(
      expect.any(Date),
    );
  });

  it('should return an empty array if the repository returns an empty array for recent transfers', async () => {
    mockRepository.findRecentTransfers.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(mockRepository.findRecentTransfers).toHaveBeenCalledTimes(1);
  });

  it('should retrieve a company after its transfer has been recorded', async () => {
    const companyRepository = new FileCompanyRepository();
    const transferRepository = new FileTransferRepository();

    const getRecentTransferCompaniesUseCase =
      new GetRecentTransferCompaniesUseCase(companyRepository);

    const recordTransferUseCase = new RecordTransferUseCase(
      transferRepository,
      companyRepository,
    );

    const companyId = randomUUID();
    const companyName = 'Test Transfer Corp ' + randomUUID();
    const companyType = CompanyType.CORPORATE;
    const joinedAt = new Date();
    const companyToRegister = new Company(
      companyId,
      companyName,
      companyType,
      joinedAt,
    );

    await companyRepository.save(companyToRegister);

    await recordTransferUseCase.execute({ companyId: companyId });

    const recentlyTransferredCompanies =
      await getRecentTransferCompaniesUseCase.execute();

    expect(recentlyTransferredCompanies.length).toBeGreaterThanOrEqual(1);
    const foundCompany = recentlyTransferredCompanies.find(
      (c) => c.id === companyId,
    );

    expect(foundCompany).toBeDefined();
    expect(foundCompany?.name).toBe(companyName);
    expect(foundCompany?.type).toBe(companyType);
  });
});
