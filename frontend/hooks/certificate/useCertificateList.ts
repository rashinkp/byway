import { useState } from "react";
import { listUserCertificates } from "@/api/certificate";
import { CertificateDTO } from "@/types/certificate";

export function useCertificateList() {
  const [certificates, setCertificates] = useState<CertificateDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchCertificates = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const result = await listUserCertificates({
        page: pageNum,
        limit,
        search: search || undefined,
        status,
        sortBy,
        sortOrder,
      });
      setCertificates(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setHasMore(result.hasMore);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || "Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  };

  return {
    certificates,
    loading,
    error,
    fetchCertificates,
    page,
    setPage,
    total,
    totalPages,
    hasMore,
    limit,
    search,
    setSearch,
    status,
    setStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  };
} 