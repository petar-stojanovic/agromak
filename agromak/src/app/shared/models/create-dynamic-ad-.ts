export interface CreateDynamicAd {
  category: string;
  itemCondition: string;
  title: string;
  title_lowercase: string;
  description: string;
  price: number;
  currency: string;
  fixedPrice: boolean;
  location: string;
  phone: string;
  images?: string[];
  additionalFields?: [{ name: string, value: string }];
}

