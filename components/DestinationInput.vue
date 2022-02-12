<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  ref,
  watch
} from '@nuxtjs/composition-api';
import useDestination, {
  Destination
} from '~/composables/useDestination'

export default defineComponent({
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    prependInnerIcon: {
      type: String,
      default: ''
    },
    value: {
      type: Object as PropType<Destination | null>,
      default: null
    }
  },
  emits: {
    'input': (payload: Destination): Destination => {
      return payload
    }
  },
  setup(props, { emit }) {
    const destination = useDestination()

    const state = reactive({
      inputValue: ref(props.value?.name),
      popupShow: ref(false)
    })

    const destinationClick = (d: Destination) => {
      destinationChoose(d)
    }
    const destinationChoose = (d: Destination) => {
      state.popupShow = false
      emit('input', d)
    }
    const nearMeClick = () => {
      destination.getCurrentPosition().then(d => {
        destinationChoose(d)
      }).catch(e => {
        window.alert(e.message)
      })
    }

    watch(() => props.value, (value) => {
      state.inputValue = value?.name
    })

    return {
      destination,
      destinationClick,
      nearMeClick,
      state
    }
  }
})
</script>

<template>
  <div>
    <v-text-field
      v-model="state.inputValue"
      v-bind="$attrs"
      readonly
      :label="$props.label"
      :placeholder="$props.placeholder"
      :prepend-inner-icon="$props.prependInnerIcon"
      @click="state.popupShow = true"
      @click:prepend-inner="state.popupShow = true"
    />
    <v-bottom-sheet v-model="state.popupShow" fullscreen scrollable>
      <v-card>
        <v-card-title class="pa-0">
          <v-app-bar dense>
            <v-app-bar-nav-icon>
              <v-btn icon @click="state.popupShow = false">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </v-app-bar-nav-icon>
            <v-app-bar-title>{{ $props.label }}</v-app-bar-title>
            <template #extension>
              <v-text-field
                v-model="destination.state.keyword"
                autocomplete="off"
                autofocus
                clearable
                dense
                full-width
                hide-details
                prepend-inner-icon="mdi-magnify"
                solo
                :loading="destination.state.loading"
                :placeholder="$props.placeholder"
              />
            </template>
          </v-app-bar>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-list dense>
            <v-list-item @click="nearMeClick">
              <v-list-item-icon>
                <v-icon>mdi-crosshairs-gps</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ $t('components.destinationInput.nearMe') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list v-if="destination.state.options.length > 0">
            <v-subheader>{{ $t('components.destinationInput.list.subheader') }}</v-subheader>
            <v-list-item
              v-for="(option, i) in destination.state.options"
              :key="i"
              dense
              @click="destinationClick(option)"
            >
              <v-list-item-content>
                <v-list-item-title class="whitespace-normal">{{ option.name }}</v-list-item-title>
                <v-list-item-subtitle class="whitespace-normal">{{ option.address }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip filter label x-small>{{ option.typeName }}</v-chip>
                <v-list-item-action-text v-if="option.totalHotel > 0">
                  {{ $tc('components.destinationInput.list.actionText', option.totalHotel, { i: option.totalHotel }) }}
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>
