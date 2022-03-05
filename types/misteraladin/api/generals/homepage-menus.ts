export enum Status {
  Active = 'active',
  Inactive = 'inactive'
}

export interface HomepageMenu {
  id: string;
  type: string;
  caption: string;
  caption_en: string;
  url: string;
  icon_svg: string;
  icon_png: string;
  status: Status;
  mode: number;
}
