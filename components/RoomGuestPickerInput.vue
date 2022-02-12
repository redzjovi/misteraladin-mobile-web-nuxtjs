<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  useContext,
  watch
} from '@nuxtjs/composition-api';

export default defineComponent({
  props: {
    guestValue: {
      type: Number,
      default: 2
    },
    label: {
      type: String,
      default: ''
    },
    prependInnerIcon: {
      type: String,
      default: ''
    },
    roomValue: {
      type: Number,
      default: 1
    }
  },
  setup(props, { emit }) {
    const { i18n } = useContext()

    const state = reactive({
      guest: ref(props.guestValue),
      maxGuest: 32,
      maxRoom: 8,
      popupShow: ref(false),
      room: ref(props.roomValue),
      roomAndGuest: computed(() => {
        return i18n.tc('components.roomGuestPickerInput.totalRoom.label', props.roomValue, { i: props.roomValue }) +
          ', ' +
          i18n.tc('components.roomGuestPickerInput.totalGuest.label', props.guestValue, { i: props.guestValue })
      })
    })

    watch(() => state.guest, (guest) => {
      if (guest < state.room) {
        state.room = guest
      }
    })

    watch(() => state.room, (room) => {
      if (room > state.guest) {
        state.guest = room
      }
    })

    const submit = () => {
      state.popupShow = false
      emit('update:guest-value', state.guest)
      emit('update:room-value', state.room)
    }

    return {
      state,
      submit
    }
  }
})
</script>

<template>
  <div>
    <v-text-field
      v-bind="$attrs"
      readonly
      :label="$props.label"
      :prepend-inner-icon="$props.prependInnerIcon"
      :value="state.roomAndGuest"
      @click:prepend-inner="state.popupShow = true"
      @click="state.popupShow = true"
    />
    <v-bottom-sheet v-model="state.popupShow">
      <v-card>
        <v-card-title class="pa-0">
          <v-app-bar dense>
            <v-app-bar-nav-icon>
              <v-btn icon @click="state.popupShow = false">
                <v-icon>mdi-window-close</v-icon>
              </v-btn>
            </v-app-bar-nav-icon>
            <v-app-bar-title>{{ $props.label }}</v-app-bar-title>
          </v-app-bar>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-list dense>
            <v-container>
              <v-row align="center">
                <v-col>{{ $t('components.roomGuestPickerInput.room.label') }}</v-col>
                <v-col align="right">
                  <v-btn
                    icon
                    outlined
                    rounded
                    small
                    :disabled="state.room === 1"
                    @click="state.room--"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <span class="mx-5">{{ state.room }}</span>
                  <v-btn
                    icon
                    outlined
                    rounded
                    small
                    :disabled="state.room >= state.maxRoom"
                    @click="state.room++"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col>{{ $t('components.roomGuestPickerInput.guest.label') }}</v-col>
                <v-col align="right">
                  <v-btn
                    icon
                    outlined
                    rounded
                    small
                    :disabled="state.guest === 1"
                    @click="state.guest--"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <span class="mx-5">{{ state.guest }}</span>
                  <v-btn
                    icon
                    outlined
                    rounded
                    small
                    :disabled="state.guest >= state.maxGuest"
                    @click="state.guest++"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    block
                    color="primary"
                    @click="submit"
                  >
                    {{ $t('components.roomGuestPickerInput.submit.label') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-list>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>
