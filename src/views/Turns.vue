<template>
  <div class="about">
    <div class="accordion">
      <div class="accordion-header">
        <div class="accordion-header-title">Manage {{ store.state.participants.length }} participant(s)</div>
        <div
          class="accordion-header-control"
          @click="active = !active"
        >
          <span v-if="!active">+</span>
          <span v-else>-</span>
        </div>
      </div>
      <div :class="{ 'accordion-content': true, active: active }">
        <div class="accordion-content-container">
          <div
            v-for="participant in store.state.participants"
            :key="participant"
            class="participant"
          >
            <div class="participant-name">{{ participant.name }}</div>
            <button @click="editing = participant">Edit</button>
            <button @click="removeParticipant(participant)">Remove</button>
          </div>
          <div class="action-buttons">
            <button @click="addParticipant">Add Participant</button>
          </div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="clearTurns">Clear turns</button>
      <button @click="nextTurn">Next turn</button>
    </div>

    <div class="turn-list">
      <turn-item
        class="turn-list-item"
        v-for="turn in store.state.turns"
        :key="turn.startTime"
        :startTime="turn.startTime"
      />
    </div>

    <participant-editor
      v-if="editing"
      :id="editing.id"
      @closing="editing = null;"
      :key="editing.id"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue, setup } from 'vue-class-component'
import { useStore } from 'vuex'
import {
  key,
  createOrUpdateParticipant,
  removeParticipant,
  selectRandomParticipant,
  giveTurn,
  clearTurns,
  Participant
} from '@/store'
import ParticipantEditor from '@/components/ParticipantEditor.vue'
import TurnItem from '@/components/TurnItem.vue'

@Options({
  components: {
    ParticipantEditor,
    TurnItem
  }
})
export default class Turns extends Vue {
  store = setup(() => useStore(key))
  active = false

  editing: Participant | null = null

  removeParticipant = removeParticipant
  clearTurns = clearTurns

  addParticipant (): void {
    const createdId = Date.now().toString()
    createOrUpdateParticipant({
      name: '',
      id: createdId
    })

    const created = this.store.state.participants.find(x => x.id === createdId)
    if (created) {
      this.editing = created
    }
  }

  async nextTurn (): Promise<void> {
    const randomParticipant = await selectRandomParticipant()

    if (randomParticipant) {
      await giveTurn(randomParticipant)
    }
  }
}
</script>

<style scoped lang="scss">
.accordion {
  display: flex;
  flex-direction: column;
  text-align: left;

  &-header {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: space-between;
    border: 1px solid lightgray;

    div {
      padding: 16px;
    }

    &-title {
      font-size: 1rem;
      flex-grow: 1;
    }

    &-control {
      box-sizing: border-box;
      text-align: center;
      min-width: 50px;
      border-left: 1px solid lightgray;
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: #e7e7e7;
        transition: background-color 0.5s;
      }
    }
  }

  &-content {
    border: 1px solid lightgrey;
    border-top: none;
    max-height: 0px;
    overflow: hidden;
    transition: max-height 100ms ease-in-out;

    &.active {
      max-height: 100vh;
    }

    &-container {
      padding: 16px;
    }
  }

  .action-buttons {
    margin-top: 10px;
  }
}

.participant {
  display: flex;
  flex-direction: row;

  &-name {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
}

.turn-list {
  display: flex;
  flex-direction: column-reverse;
}
</style>
