import { GenerateCertificateInputDto, GenerateCertificateOutputDto } from "../../../dtos/certificate.dto";


export interface IGenerateCertificateUseCase {
  execute(
    request: GenerateCertificateInputDto
  ): Promise<GenerateCertificateOutputDto>;
}
