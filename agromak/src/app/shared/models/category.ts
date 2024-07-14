export interface CategoryList {
  categories: Category[];
}

export interface Category {
  name: string;
  icon?: string;
  sub_categories: SubCategory[];
}

export interface SubCategory {
  name: string;
  parent: string;
  icon?: string;
  sub_categories?: SubCategory[];
}

