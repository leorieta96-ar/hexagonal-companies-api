import { CompanyType } from "./company-type.enum";

export class Company {
    constructor(
      public readonly id: string,
      public readonly name: string,
      public readonly type: CompanyType,
      public readonly joinedAt: Date,
      public lastTransferDate?: Date
    ) {}
  }
  