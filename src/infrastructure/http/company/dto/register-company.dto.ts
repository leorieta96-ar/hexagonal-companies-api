import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CompanyType } from '../../../../domain/company-type.enum';

export class RegisterCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(CompanyType)
  type: CompanyType;
}
