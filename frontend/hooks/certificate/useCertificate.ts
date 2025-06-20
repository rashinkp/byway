import { useState } from "react";
import { getCertificate, generateCertificate } from "@/api/certificate";
import { CertificateDTO } from "@/types/certificate";

export function useCertificate(courseId: string) {
  const [certificate, setCertificate] = useState<CertificateDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificate = async () => {
    setLoading(true);
    setError(null);
    try {
      const cert = await getCertificate(courseId);
      setCertificate(cert);
    } catch (err: any) {
      setError(err.message || "Failed to fetch certificate");
    } finally {
      setLoading(false);
    }
  };

  const createCertificate = async () => {
    setLoading(true);
    setError(null);
    try {
      const cert = await generateCertificate(courseId);
      setCertificate(cert);
    } catch (err: any) {
      setError(err.message || "Failed to generate certificate");
    } finally {
      setLoading(false);
    }
  };

  return { certificate, loading, error, fetchCertificate, createCertificate };
} 