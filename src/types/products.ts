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

export interface ProductData {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  mainPicture: string;
  imageGallery: string[];
  productAttributes: ProductAttribute[];
}

export interface ProductAttribute {
  id: number;
  name: string;
  options: ProductOption[];
}

export interface ProductAttributeAO {
  attributeId: number;
  attributeName: string;
  options: ProductOption[];
}

export interface ProductOption {
  id: number;
  name: string;
}
