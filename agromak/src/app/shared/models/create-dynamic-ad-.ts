import {GalleryPhoto} from "@capacitor/camera";

export interface CreateDynamicAd {
  category: string
  itemCondition: string
  title: string
  description: string
  price: string
  currency: string
  fixedPrice: string
  location: string
  phone: string
  images?: GalleryPhoto[]
}
