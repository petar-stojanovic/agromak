import {Ad} from "./ad";

export interface AdListAdditionalData {
  searchValue?: string,
  lastVisibleAd?: Ad,
  similarAd?: Ad,
  order?: 'asc' | 'desc'
}
