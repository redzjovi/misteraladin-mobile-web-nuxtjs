export default {
  cancel: 'Batal',
  filter: 'Saring',
  ok: 'Oke',
  period: 'Periode',

  components: {
    destinationInput: {
      list: {
        actionText: '{i} properti | {i} properti',
        subheader: 'Destinasi populer'
      },
      nearMe: 'Dekat saya'
    },
    roomGuestPickerInput: {
      guest: {
        label: 'Tamu'
      },
      room: {
        label: 'Kamar'
      },
      submit: {
        label: 'Selesai'
      },
      totalGuest: {
        label: '{i} tamu | {i} tamu'
      },
      totalRoom: {
        label: '{i} kamar | {i} kamar'
      }
    }
  },
  composables: {
    useReview: {
      sort: {
        default: 'Paling membantu',
        latest: 'Terbaru',
        scoreHighest: 'Rating tertinggi',
        scoreLowest: 'Rating terendah',
      }
    }
  },
  pages: {
    hotel: {
      form: {
        checkIn: {
          label: 'Check in',
          placeholder: 'Check in',
        },
        checkOut: {
          label: 'Check out',
          placeholder: 'Check out',
        },
        destination: {
          label: 'Destinasi',
          placeholder: 'Nginap dimana?'
        },
        gps: {
          alert: 'Lokasi tidak terdeteksi. Silakan aktifkan Layanan Lokasi kemudian segarkan browser Anda, atau pilih tujuan secara manual.'
        },
        roomAndGuest: {
          label: 'Kamar & tamu'
        },
        submit: {
          label: 'Cari'
        }
      },
      title: 'Hotel'
    },
    'hotel-countrySlug-hotelSlug': {
      facility: {
        title: 'Fasilitas'
      },
      fromIReview: 'Dari {i} ulasan | Dari {i} ulasan',
      hotel: 'Hotel',
      photo: {
        more: '{i} lainnya'
      },
      review: {
        sort: {
          label: 'Urutkan'
        },
        title: 'Ulasan'
      },
      topFacilities: {
        seeAll: 'Lihat semua',
        title: 'Facilitas populer'
      },
      topReview: {
        seeAll: 'Lihat semua'
      }
    },
    'hotel-search': {
      appBar: {
        totalNight: '{i} malam | {i} malam'
      },
      changeSearch: {
        title: 'Ubah pencarian'
      },
      filter: {
        apply: {
          label: 'Terapkan'
        },
        area: {
          label: 'Area'
        },
        facilities: {
          label: 'Fasilitas'
        },
        hotelRating: {
          label: 'Hotel rating'
        },
        hotelStar: {
          label: 'Hotel star'
        },
        label: 'Saring',
        priceRange: {
          label: 'Rentang harga'
        },
        propertyType: {
          label: 'Tipe properti'
        },
        reset: {
          label: 'Atur ulang'
        },
        save: {
          label: 'Simpan'
        },
        showAll: {
          label: 'Selengkapnya'
        },
        title: 'Saring'
      },
      freeBreakfast: 'Sarapan gratis',
      freeCancellation: 'Pembatalan gratis',
      sort: {
        label: 'Urutkan',
        options: {
          default: {
            label: 'Rekomendasi'
          },
          priceHighest: {
            label: 'Harga (termahal lebih dulu)'
          },
          priceLowest: {
            label: 'Harga (termurah lebih dulu)'
          },
          starRatingHighest: {
            label: 'Bintang hotel (tertinggi lebih dulu)'
          },
          starRatingLowest: {
            label: 'Bintang hotel (terendah lebih dulu)'
          }
        },
        title: 'Urutkan'
      },
      totalDistance: {
        label: '{i} dari lokasi pencarian Anda'
      }
    }
  }
}
