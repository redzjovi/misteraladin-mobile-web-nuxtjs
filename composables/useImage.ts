import { Hotel as HotelHotel } from '~/types/misteraladin/api/hotels'

export interface Image {
  url: string;
}

export default () => {
  const hotelHotelToImage = (h: HotelHotel): Image => {
    return {
      url: h.original_image_url_resized
    }
  }

  return {
    hotelHotelToImage
  }
}
