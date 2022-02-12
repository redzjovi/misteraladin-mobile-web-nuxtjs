export interface Banner {
  id: number;
  title: string;
  title_en: string;
  description: string;
  description_en: null | string;
  image_url: string;
  image_url_en: string;
  link: string;
  type: string;
  product_type: string;
  product_type_name: string;
  slug_detail: string;
  position: string;
  domain: string;
  start_date: string;
  end_date: string;
  sequence: number;
  is_show_description: null;
  position_description: string;
  filename: string;
  filename_en: string;
  landing_link: string;
  landing_link_en: string;
  share_link: string;
  share_text: string;
  created_by: number;
}

export interface Response {
  data: Banner[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      links: string[];
    },
  },
}
