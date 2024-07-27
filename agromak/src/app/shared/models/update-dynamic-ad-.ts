import {GalleryPhoto} from "@capacitor/camera";

export interface UpdateDynamicAd {
  id: string;
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
  images?: GalleryPhoto[] | string[];
  oldImages?: string[];
  additionalFields?: [{name: string, value: string}];
}

