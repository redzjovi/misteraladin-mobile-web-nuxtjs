export interface ElementValueFilter {
  type: string;
  category_id: number[];
}

export interface ElementValue {
  indonesian?: string;
  'label-indonesian'?: string;
  english?: string;
  'label-english'?: string;
  from?: string;
  to?: string;
  filter?: ElementValueFilter;
}

export interface Element {
  text: string;
  value: ElementValue;
}

export interface LandingPage {
  id: string | null | number;
  name: string;
  url: string;
  periode: {
    from: string;
    to: string;
  },
  is_custom: boolean,
  banner: string;
  banner_mobile: string;
  search_bar: boolean;
  sequence: number;
  has_english: boolean;
  description: string;
  description_en: string;
  elements: Element[];
  share_link: string;
  share_text: string;
}

export interface Response {
  data: LandingPage;
}
