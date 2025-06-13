import { RecordTransferUseCase } from '../../../src/application/use-cases/record-transfer.use-case';
import { FileCompanyRepository } from '../../../src/infrastructure/persistence/file-company.repository';
import { FileTransferRepository } from '../../../src/infrastructure/persistence/file-transfer.repository';
import { Company } from '../../../src/domain/company.entity';
import { CompanyType } from '../../../src/domain/company-type.enum';
import { NotFoundException } from '@nestjs/common';
import { Transfer } from '../../../src/domain/transfer.entity';

describe('RecordTransferUseCase', () => {
  let repositoryCompany: FileCompanyRepository;
  let repositoryTransfer: FileTransferRepository;
  let useCase: RecordTransferUseCase;

  beforeEach(() => {
    repositoryCompany = new FileCompanyRepository();
    repositoryTransfer = new FileTransferRepository();
    useCase = new RecordTransferUseCase(repositoryTransfer, repositoryCompany);
  });

  it('should record a transfer for an existing company', async () => {
    const companyId = 'test-company-id';
    const company = new Company(
      companyId,
      'Test Corp',
      CompanyType.CORPORATE,
      new Date(),
    );
    await repositoryCompany.save(company);

    jest.spyOn(repositoryTransfer, 'save');
    jest.spyOn(repositoryCompany, 'findById');

    await useCase.execute({ companyId });

    expect(repositoryCompany.findById).toHaveBeenCalledWith(companyId);
    expect(repositoryTransfer.save).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException if the company does not exist', async () => {
    const nonExistentCompanyId = 'non-existent-id';
    jest.spyOn(repositoryCompany, 'findById');
    jest.spyOn(repositoryTransfer, 'save');

    await expect(
      useCase.execute({ companyId: nonExistentCompanyId }),
    ).rejects.toThrow(NotFoundException);
    expect(repositoryCompany.findById).toHaveBeenCalledWith(
      nonExistentCompanyId,
    );
    expect(repositoryTransfer.save).not.toHaveBeenCalled();
  });

  it('should call repository.findById with the correct companyId', async () => {
    const companyId = 'test-company-id';

    repositoryCompany.findById = jest
      .fn()
      .mockResolvedValue(
        new Company(companyId, 'Test', CompanyType.PYME, new Date()),
      );
    jest.spyOn(repositoryTransfer, 'save');

    await useCase.execute({ companyId });

    expect(repositoryCompany.findById).toHaveBeenCalledWith(companyId);
  });

  it('should call repository.recordTransfer with a new Transfer object', async () => {
    const companyId = 'company-uuid';
    const company = new Company(
      companyId,
      'Test Company',
      CompanyType.CORPORATE,
      new Date(),
    );
    await repositoryCompany.save(company);

    jest.spyOn(repositoryTransfer, 'save');

    await useCase.execute({ companyId });

    expect(repositoryTransfer.save).toHaveBeenCalledTimes(1);
    const transferArgument = (repositoryTransfer.save as jest.Mock).mock
      .calls[0][0];
    expect(transferArgument).toBeInstanceOf(Transfer);
    expect(transferArgument.companyId).toBe(companyId);
    expect(transferArgument.id).toEqual(expect.any(String));
    expect(transferArgument.date).toBeInstanceOf(Date);
  });
});
