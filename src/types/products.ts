export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  productTypeName: string;
  price: number;
  mainPicture: string;
}

export interface ProductsResponse {
  products: Product[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  lastPage: boolean;
}