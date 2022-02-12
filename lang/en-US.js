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
        roomAndGuest: {
          label: 'Room & guest'
        }
      },
      title: 'Hotel'
    }
  }
}
