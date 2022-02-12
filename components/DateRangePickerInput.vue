<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  useContext,
  watch
} from "@nuxtjs/composition-api"

export default defineComponent({
  props: {
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    fromShow: {
      type: Boolean,
      default: false
    },
    fromValue: {
      type: String,
      required: true
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
    toShow: {
      type: Boolean,
      default: false
    },
    toValue: {
      type: String,
      required: true
    },
  },
  setup(props, { emit }) {
    const { $dayjs } = useContext()

    const state = reactive({
      fromValueDayjs: computed(() => $dayjs(props.fromValue)),
      popupShow: ref(false),
      rangeModel: ref([
        props.fromValue,
        props.toValue,
      ]),
      toValueDayjs: computed(() => $dayjs(props.toValue))
    })

    watch(() => [props.fromValue, props.toValue], () => {
      state.rangeModel = [
        props.fromValue,
        props.toValue
      ]
    })

    const dateChange = (v: string[]) => {
      v.sort()
      state.popupShow = false
      emit('update:from-value', v[0])
      emit('update:to-value', v[1])
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
      v-if="$props.fromShow"
      v-bind="$attrs"
      readonly
      :label="$props.label"
      :placeholder="$props.placeholder"
      :prepend-inner-icon="$props.prependInnerIcon"
      :value="state.fromValueDayjs.format($props.format)"
      @click:prepend-inner="state.popupShow = true"
      @click="state.popupShow = true"
    />
    <v-text-field
      v-if="$props.toShow"
      v-bind="$attrs"
      readonly
      :label="$props.label"
      :placeholder="$props.placeholder"
      :prepend-inner-icon="$props.prependInnerIcon"
      :value="state.toValueDayjs.format($props.format)"
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
          <v-date-picker
            v-model="state.rangeModel"
            full-width
            range
            :min="$props.min"
            @change="dateChange"
          />
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>
