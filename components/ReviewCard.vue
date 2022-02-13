<script lang="ts">
import {
  defineComponent,
  PropType,
} from '@nuxtjs/composition-api';
import { Review } from '~/composables/useReview';

export default defineComponent({
  props: {
    contentLengthMax: {
      type: Number,
      default: 0
    },
    value: {
      type: Object as PropType<null | Review>,
      default: null
    }
  }
})
</script>

<template>
  <v-card v-if="$props.value" v-bind="$attrs" outlined>
    <v-card-text>
      <div class="d-flex flex-row">
        <div class="flex-grow-1">
          <div v-if="$props.value.from">{{ $props.value.from.name }}</div>
          <div>
            {{ $dayjs($props.value.date).format('DD MMM YYYY') }} -
            {{ $props.value.typeName }}
          </div>
        </div>
        <div>
          <v-chip color="primary" small>{{ $props.value.score }}</v-chip>
        </div>
      </div>
      <v-divider />
      <div
        v-if="$props.contentLengthMax"
      >{{ $props.contentLengthMax > 0 && $props.value.content.length > $props.contentLengthMax ? $props.value.content.slice(0, $props.contentLengthMax) + '...' : $props.value.content }}</div>
    </v-card-text>
  </v-card>
</template>
