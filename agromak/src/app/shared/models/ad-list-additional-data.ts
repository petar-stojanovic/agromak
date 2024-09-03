import {Ad} from "./ad";

export class AdListAdditionalData {
  searchValue?: string;
  lastVisibleAd?: Ad;
  similarAd?: Ad;
  order: 'asc' | 'desc' = "desc"
}
