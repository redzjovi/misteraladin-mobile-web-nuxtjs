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
        roomAndGuest: {
          label: 'Kamar & tamu'
        }
      },
      title: 'Hotel'
    }
  }
}
