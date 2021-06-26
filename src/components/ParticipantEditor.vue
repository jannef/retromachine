<template>
  <div class="participant-editor">
    <div class="work-area">
      <form v-if="participant">
        <label>
          <span>Id</span>
          <input
            type="text"
            disabled
            v-model="v$.id.$model"
          />
        </label>

        <label>
          <span>Name</span>
          <input
            type="text"
            required
            v-model="v$.name.$model"
            :class="{ invalid: v$.name.$error, dirty: v$.name.$dirty }"
          />
        </label>
      </form>
      <div class="action-buttons">
        <button @click="saveChanges">Save</button>
        <button @click="discardChanges">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { key, Participant, createOrUpdateParticipant } from '@/store'
import { defineComponent, ref } from 'vue'

const closing = 'closing'

export default defineComponent({
  props: {
    id: String
  },
  setup () {
    const store = useStore(key)
    const participant = ref(new Participant())
    const validationRules = {
      name: {
        required
      },
      id: {
        required
      }
    }

    const v$ = useVuelidate(validationRules, participant)

    return {
      store,
      participant,
      v$
    }
  },
  methods: {
    discardChanges (): void {
      this.$emit(closing)
    },
    async saveChanges (): Promise<void> {
      if (!await this.v$.$validate()) {
        console.log(this.v$.$errors)
        return
      }

      if (this.id && this.participant) {
        createOrUpdateParticipant(this.participant)
      }
      this.$emit(closing)
    }
  },
  mounted () {
    if (this.id) {
      const loadedParticipant = Object.assign({}, this.store.state.participants.find(x => x.id === this.id))
      if (loadedParticipant) {
        this.participant = loadedParticipant
      }
    }
  }
})
</script>

<style scoped lang="scss">
.participant-editor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(3px);

  display: flex;
  align-items: center;
  justify-content: center;

  .work-area {
    padding: 20px;
    margin: 5px;
    background: white;

    form {
      display: flex;
      flex-direction: column;

      label {
        display: flex;
        flex-direction: column;

        margin-bottom: 10px;

        span {
          text-align: left;
        }
      }
    }
  }
}
</style>
