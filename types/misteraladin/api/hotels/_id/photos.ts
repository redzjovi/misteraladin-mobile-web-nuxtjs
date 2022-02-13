export interface Photo {
  caption: null | string;
  url: string;
  thumb_url: string;
  original_image_url_resized: number;
}

export interface ResponseBody {
  data: Photo[]
}
