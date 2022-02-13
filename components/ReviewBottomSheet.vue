<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  ref,
  watch
} from '@nuxtjs/composition-api';
import { Review } from '~/composables/useReview';

export default defineComponent({
  components: {
    ReviewCard: () => import('~/components/ReviewCard.vue')
  },
  props: {
    contentLengthMax: {
      type: Number,
      default: 0
    },
    review: {
      type: Object as PropType<null | Review>,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'input': (payload: boolean): boolean => {
      return payload
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      inputValue: ref(props.value)
    })

    watch(() => props.value, value => {
      state.inputValue = value
    })

    watch(() => state.inputValue, value => {
      emit('input', value)
    })

    return {
      state
    }
  }
})
</script>

<template>
  <div>
    <v-bottom-sheet v-model="state.inputValue" scrollable>
      <v-card>
        <v-card-title class="pa-0">
          <v-app-bar dense>
            <v-app-bar-nav-icon>
              <v-btn icon @click="state.inputValue = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-app-bar-nav-icon>
          </v-app-bar>
        </v-card-title>
        <v-card-text class="pa-4">
          <ReviewCard
            v-if="$props.review"
            :content-length-max="$props.contentLengthMax"
            :value="$props.review"
          />
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>
