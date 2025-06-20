import { useState } from "react";
import { listUserCertificates } from "@/api/certificate";
import { CertificateDTO } from "@/types/certificate";

export function useCertificateList() {
  const [certificates, setCertificates] = useState<CertificateDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const certs = await listUserCertificates();
      setCertificates(certs);
    } catch (err: any) {
      setError(err.message || "Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  };

  return { certificates, loading, error, fetchCertificates };
} 