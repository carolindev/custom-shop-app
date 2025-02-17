export interface ProductType {
    id: string;
    name: string;
    config: {
      customisation: "fully_customizable" | "not_customizable";
    };
  }  

export interface Option {
    id: number;
    name: string;
  }
  
export interface Attribute {
    id: number;
    name: string;
    options: Option[];
  }

export interface AttributeString {
    attributeName: string;
    possibleOptions: string[];
  }
  
export interface ProductTypeDetails {
    id: string;
    name: string;
    config: { customization: string };
    attributes: {
      id: number;
      name: string;
      options: { id: number; name: string }[];
    }[];
    notAllowedCombinations: { attributeId: number; attributeOptionId: number }[][];
  }

export interface ProductTypeData {
  id: string;
  name: string;
  attributes: {
    id: number;
    name: string;
    options: {
      id: number;
      name: string;
    }[];
  }[];
  notAllowedCombinations: {
    combinationId: number;
    options: { id: number; name: string }[];
  }[];
}