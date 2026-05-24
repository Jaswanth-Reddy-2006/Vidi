export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SearchParams {
  page?: string;
  limit?: string;
  sort?: string;
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  fabric?: string;
  color?: string;
  isNewArrival?: string;
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popularity' | 'rating' | 'sale';

export interface FilterState {
  category: string[];
  fabric: string[];
  color: string[];
  minPrice: number | null;
  maxPrice: number | null;
  isNewArrival: boolean;
}

export interface PriceRange {
  min: number;
  max: number;
}
