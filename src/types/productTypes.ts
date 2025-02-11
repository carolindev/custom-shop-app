export interface ProductType {
    id: string;
    name: string;
    config: {
      customisation: "fully_customizable" | "not_customizable";
    };
  }  