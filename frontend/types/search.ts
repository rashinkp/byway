
export interface ISearchResult {
  instructors: {
    items: {
      id: string;
      name: string;
      avatar: string | null;
      shortBio: string;
    }[];
    total: number;
    page: number;
    limit: number;
  };
  courses: {
    items: {
      id: string;
      title: string;
      thumbnail: string | null;
      price: number;
      offer?: number;
    }[];
    total: number;
    page: number;
    limit: number;
  };
  categories: {
    items: {
      id: string;
      title: string;
      description: string;
    }[];
    total: number;
    page: number;
    limit: number;
  };
  certificates: {
    items: {
      id: string;
      certificateNumber: string;
      courseTitle: string;
      userName: string;
      issuedAt: string | null;
      pdfUrl: string;
    }[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
  userId?: string;
}

export interface UseGlobalSearchReturn {
  data: ISearchResult | undefined;
  isLoading: boolean;
  error: { message: string } | null;
  refetch: () => void;
}
