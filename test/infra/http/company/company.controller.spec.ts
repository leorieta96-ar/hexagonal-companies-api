import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '../../../../src/infrastructure/http/company/company.controller';
import { RegisterCompanyDto } from '../../../../src/infrastructure/http/company/dto/register-company.dto';
import { CompanyType } from '../../../../src/domain/company-type.enum';
import { Company } from '../../../../src/domain/company.entity';
import { randomUUID } from 'crypto';

interface ServiceMocksType {
  registerExecute?: jest.Mock;
  getJoinedExecute?: jest.Mock;
  getTransfersExecute?: jest.Mock;
  recordTransferExecute?: jest.Mock;
  repoFindRecentTransfers?: jest.Mock;
  repoFindRecentJoins?: jest.Mock;
  repoFindById?: jest.Mock;
  repoSave?: jest.Mock;
  repoRecordTransfer?: jest.Mock;
}

const serviceMocks: ServiceMocksType = {};
jest.mock(
  '../../../../src/infrastructure/persistence/file-company.repository',
  () => {
    return {
      FileCompanyRepository: jest.fn().mockImplementation(() => ({
        findRecentTransfers: (...args) =>
          serviceMocks.repoFindRecentTransfers?.(...args),
        findRecentJoins: (...args) =>
          serviceMocks.repoFindRecentJoins?.(...args),
        findById: (...args) => serviceMocks.repoFindById?.(...args),
        save: (...args) => serviceMocks.repoSave?.(...args),
        recordTransfer: (...args) => serviceMocks.repoRecordTransfer?.(...args),
      })),
    };
  },
);

jest.mock(
  '../../../../src/application/use-cases/register-company.use-case',
  () => {
    return {
      RegisterCompanyUseCase: jest.fn().mockImplementation(() => ({
        execute: (...args) => serviceMocks.registerExecute?.(...args),
      })),
    };
  },
);
jest.mock(
  '../../../../src/application/use-cases/get-recent-joined-companies.use-case',
  () => {
    return {
      GetRecentJoinedCompaniesUseCase: jest.fn().mockImplementation(() => ({
        execute: (...args) => serviceMocks.getJoinedExecute?.(...args),
      })),
    };
  },
);
jest.mock(
  '../../../../src/application/use-cases/get-recent-transfer-companies.use-case',
  () => {
    return {
      GetRecentTransferCompaniesUseCase: jest.fn().mockImplementation(() => ({
        execute: (...args) => serviceMocks.getTransfersExecute?.(...args),
      })),
    };
  },
);
jest.mock(
  '../../../../src/application/use-cases/record-transfer.use-case',
  () => {
    return {
      RecordTransferUseCase: jest.fn().mockImplementation(() => ({
        execute: (...args) => serviceMocks.recordTransferExecute?.(...args),
      })),
    };
  },
);

describe('CompanyController', () => {
  let controller: CompanyController;

  beforeAll(() => {
    serviceMocks.registerExecute = jest.fn();
    serviceMocks.getJoinedExecute = jest.fn();
    serviceMocks.getTransfersExecute = jest.fn();
    serviceMocks.recordTransferExecute = jest.fn();

    serviceMocks.repoFindRecentTransfers = jest.fn();
    serviceMocks.repoFindRecentJoins = jest.fn();
    serviceMocks.repoFindById = jest.fn();
    serviceMocks.repoSave = jest.fn();
    serviceMocks.repoRecordTransfer = jest.fn();
  });

  beforeEach(async () => {
    Object.values(serviceMocks).forEach((mockFn) => {
      if (jest.isMockFunction(mockFn)) {
        mockFn.mockReset();
      }
    });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call registerUseCase.execute with the DTO and return status ok', async () => {
      const dto: RegisterCompanyDto = {
        name: 'Test Corp Inc.',
        type: CompanyType.CORPORATE,
      };
      serviceMocks.registerExecute?.mockResolvedValue(undefined);

      const result = await controller.register(dto);

      expect(serviceMocks.registerExecute).toHaveBeenCalledTimes(1);
      expect(serviceMocks.registerExecute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ status: 'ok' });
    });
  });

  describe('getJoined', () => {
    it('should call joinedUseCase.execute and return its result', async () => {
      const mockCompanyArray: Company[] = [
        new Company(randomUUID(), 'Joined Co 1', CompanyType.PYME, new Date()),
      ];
      serviceMocks.getJoinedExecute?.mockResolvedValue(mockCompanyArray);

      const result = await controller.getJoined();

      expect(serviceMocks.getJoinedExecute).toHaveBeenCalledTimes(1);
      expect(serviceMocks.getJoinedExecute).toHaveBeenCalledWith();
      expect(result).toEqual(mockCompanyArray);
    });

    it('should return an empty array if joinedUseCase.execute returns an empty array', async () => {
      serviceMocks.getJoinedExecute?.mockResolvedValue([]);

      const result = await controller.getJoined();

      expect(serviceMocks.getJoinedExecute).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('getTransfers', () => {
    it('should call transferUseCase.execute and return its result', async () => {
      const mockCompanyArray: Company[] = [
        new Company(
          randomUUID(),
          'Transfer Co 1',
          CompanyType.CORPORATE,
          new Date(),
        ),
      ];
      serviceMocks.getTransfersExecute?.mockResolvedValue(mockCompanyArray);

      const result = await controller.getTransfers();

      expect(serviceMocks.getTransfersExecute).toHaveBeenCalledTimes(1);
      expect(serviceMocks.getTransfersExecute).toHaveBeenCalledWith();
      expect(result).toEqual(mockCompanyArray);
    });

    it('should return an empty array if transferUseCase.execute returns an empty array', async () => {
      serviceMocks.getTransfersExecute?.mockResolvedValue([]);

      const result = await controller.getTransfers();

      expect(serviceMocks.getTransfersExecute).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });
});
