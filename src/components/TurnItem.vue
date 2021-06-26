<template>
  <div class="turn-item" v-if="participant">
    {{ participant.name }}
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { key, Participant, Turn } from '@/store'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    startTime: Number
  },
  setup () {
    const store = useStore(key)
    return {
      store
    }
  },
  computed: {
    turn (): Turn | null {
      return this.store.state.turns.find(x => x.startTime === this.startTime) ?? null
    },
    participant (): Participant | null {
      return this.store.state.participants.find(x => x.id === this.turn?.participantId) ?? null
    }
  }
})
</script>

<style scoped lang="scss">
.turn-item {
  margin: 1px 0;
  padding: 16px;
  border: 1px solid #aaa;
}
</style>
