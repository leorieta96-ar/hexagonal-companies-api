import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from '../../../../src/infrastructure/http/transfer/transfer.controller';
import { RecordTransferDto } from '../../../../src/infrastructure/http/transfer/dto/record-transfer.dto';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

interface ServiceMocksType {
  recordTransferExecute?: jest.Mock;
}

const serviceMocks: ServiceMocksType = {};

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

describe('TransferController', () => {
  let controller: TransferController;

  beforeAll(() => {
    serviceMocks.recordTransferExecute = jest.fn();
  });

  beforeEach(async () => {
    serviceMocks.recordTransferExecute?.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
    }).compile();

    controller = module.get<TransferController>(TransferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('recordTransfer', () => {
    it('should call recordTransferUseCase.execute with the DTO and return status ok', async () => {
      const dto: RecordTransferDto = { companyId: randomUUID() };
      serviceMocks.recordTransferExecute?.mockResolvedValue(undefined);

      const result = await controller.recordTransfer(dto);

      expect(serviceMocks.recordTransferExecute).toHaveBeenCalledTimes(1);
      expect(serviceMocks.recordTransferExecute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ status: 'ok' });
    });

    it('should propagate errors from recordTransferUseCase.execute', async () => {
      const dto: RecordTransferDto = { companyId: randomUUID() };
      const errorMessage = 'Company not found for transfer';
      const testError = new NotFoundException(errorMessage);
      serviceMocks.recordTransferExecute?.mockRejectedValue(testError);

      await expect(controller.recordTransfer(dto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.recordTransfer(dto)).rejects.toThrow(
        errorMessage,
      );

      expect(serviceMocks.recordTransferExecute).toHaveBeenCalledWith(dto);
    });
  });
});
