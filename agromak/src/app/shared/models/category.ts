export interface Category {
  name: string;
  order: number;
  sub_categories: SubCategory[];
}

export interface SubCategory {
  name: string;
  order: number;
  sub_categories?: SubCategory[];
}

