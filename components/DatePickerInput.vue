<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  useContext
} from "@nuxtjs/composition-api"

export default defineComponent({
  props: {
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    label: {
      type: String,
      default: ''
    },
    min: {
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
      type: String,
      required: true
    }
  },
  emits: {
    input(payload: Date): Date {
      return payload
    }
  },
  setup(props, { emit }) {
    const { $dayjs } = useContext()

    const state = reactive({
      popupShow: ref(false),
      valueDayjs: computed(() => $dayjs(props.value))
    })

    const dateChange = (v: string) => {
      state.popupShow = false
      emit('input', v)
    }

    return {
      dateChange,
      state
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
      :placeholder="$props.placeholder"
      :prepend-inner-icon="$props.prependInnerIcon"
      :value="state.valueDayjs.format($props.format)"
      @click:prepend-inner="state.popupShow = true"
      @click="state.popupShow = true"
    />
    <v-bottom-sheet v-model="state.popupShow" fullscreen scrollable>
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
          <v-date-picker full-width :min="$props.min" :value="$props.value" @change="dateChange" />
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>
