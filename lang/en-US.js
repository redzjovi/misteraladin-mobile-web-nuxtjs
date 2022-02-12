export default {
  cancel: 'Cancel',
  filter: 'Filter',
  ok: 'Ok',
  period: 'Period',

  components: {
    destinationInput: {
      list: {
        actionText: '{i} property | {i} properties',
        subheader: 'Popular destination'
      },
      nearMe: 'Near me'
    },
    roomGuestPickerInput: {
      guest: {
        label: 'Guest'
      },
      room: {
        label: 'Room'
      },
      submit: {
        label: 'Done'
      },
      totalGuest: {
        label: '{i} guest | {i} guests'
      },
      totalRoom: {
        label: '{i} room | {i} rooms'
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
          label: 'Destination',
          placeholder: 'Staying anywhere?'
        },
        gps: {
          alert: 'Location not detected. Please activate Location Service then refresh your browser, or choose destination manually.'
        },
        roomAndGuest: {
          label: 'Room & guest'
        },
        submit: {
          label: 'Search'
        }
      },
      title: 'Hotel'
    },
    'hotel-search': {
      appBar: {
        totalNight: '{i} night | {i} nights'
      },
      changeSearch: {
        title: 'Change search'
      },
      freeBreakfast: 'Free breakfast',
      freeCancellation: 'Free cancellation',
      sort: {
        label: 'Sort',
        options: {
          default: {
            label: 'Recommended'
          },
          priceHighest: {
            label: 'Price (highest first)'
          },
          priceLowest: {
            label: 'Price (lowest first)'
          },
          starRatingHighest: {
            label: 'Hotel star (highest first)'
          },
          starRatingLowest: {
            label: 'Hotel star (lowest first)'
          }
        },
        title: 'Sort by'
      },
      totalDistance: {
        label: '{i} from your search location'
      }
    }
  }
}
