import { CertificateDTO } from "../../../dtos/certificate.dto";

export interface IGetCertificateUseCase {
  execute(input: { userId: string; courseId: string }): Promise<CertificateDTO | null>;
}



