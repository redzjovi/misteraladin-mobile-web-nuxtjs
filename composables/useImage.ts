import { Hotel as HotelHotel } from '~/types/misteraladin/api/hotels'
import { Photo as HotelIdPhoto } from '~/types/misteraladin/api/hotels/_id/photos'

export interface Image {
  thumbnailUrl: string;
  title: string;
  url: string;
}

export default () => {
  const hotelHotelToImage = (h: HotelHotel): Image => {
    return {
      thumbnailUrl: h.thumbnail_url,
      title: h.name,
      url: h.original_image_url_resized,
    }
  }

  const hotelIdPhotoToImage = (p: HotelIdPhoto): Image => {
    return {
      thumbnailUrl: p.thumb_url,
      title: p.caption ? p.caption : '',
      url: p.url
    }
  }

  return {
    hotelHotelToImage,
    hotelIdPhotoToImage
  }
}
