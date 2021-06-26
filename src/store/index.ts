import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

export class Participant {
  id: string
  name: string

  constructor () {
    this.id = ''
    this.name = ''
  }
}

export class Turn {
  participantId: string
  startTime: number
  endTime?: number

  constructor (participant: Participant) {
    this.participantId = participant.id
    this.startTime = Date.now()
  }
}

export interface State {
  participants: Participant[],
  turns: Turn[]
}

export const key: InjectionKey<Store<State>> = Symbol('primary user store key')

// mutation names
export const setParticipants = 'setParticipants'
export const setTurns = 'setTurns'

export const store: Store<State> = createStore<State>({
  state: {
    participants: [],
    turns: []
  },
  actions: {
    createOrUpdateParticipant ({ state, commit }, participant: Participant) {
      const index = state.participants.findIndex(x => x.id === participant.id)
      if (index < 0) {
        // create
        const participants = [...state.participants, participant]
        commit(setParticipants, participants)
      } else {
        // update
        const participants = [...state.participants]
        participants[index] = participant
        commit(setParticipants, participants)
      }
    },
    removeParticipant ({ state, commit }, participant: Participant) {
      const participants = state.participants.filter(x => x.id !== participant.id)
      commit(setParticipants, participants)
    },
    selectRandomParticipant ({ state }) {
      const numberOfParticipants = state.participants.length
      switch (numberOfParticipants) {
        case 0: {
          return
        }
        case 1: {
          // if there is just one participant, well...
          return store.state.participants[0]
        }
        default: {
          // Subsequent turns, select someone else than the current in-turn participant
          if (state.turns.length) {
            const currentTurn = state.turns[state.turns.length - 1]
            // eligible should have atleast one participant, as there is total two participants or more
            // in this branch
            const eligible = store.state.participants.filter((x: Participant) => x.id !== currentTurn.participantId)
            return eligible[Math.floor(Math.random() * eligible.length)]
          } else {
            return state.participants[Math.floor(Math.random() * state.participants.length)]
          }
        }
      }
    },
    giveTurn ({ state, commit }, participant: Participant) {
      if (!state.participants.some(x => x.id === participant.id)) {
        return
      }

      const turns = [...(state.turns ?? []), new Turn(participant)]
      // End the current turn
      if (turns.length > 1) {
        console.log('turns', turns)
        const toEnd = turns[turns.length - 2]
        if (toEnd) {
          toEnd.endTime = Date.now()
        }
      }

      commit(setTurns, turns)
    },
    clearTurns ({ commit }) {
      commit(setTurns, [])
    }
  },
  mutations: {
    [setParticipants] (state, participants: Participant[]) {
      state.participants = participants
    },
    [setTurns] (state, turns: Turn[]) {
      state.turns = turns
    }
  }
})

const statePersistentName = 'retromachine'
// Watches the store, and persists it to local storage
store.watch(() => JSON.stringify(store.state), (value) => localStorage.setItem(statePersistentName, value))

export const loadState = (): Store<State> => {
  const persistedState = localStorage.getItem(statePersistentName)

  // localStorage returns DOMString, not a JS type. DOMString directly maps into string!
  if (persistedState && persistedState !== 'undefined' && persistedState !== 'null') {
    store.replaceState(JSON.parse(persistedState))
  }

  return store
}

export const createOrUpdateParticipant = (participant: Participant): Promise<void> => store.dispatch('createOrUpdateParticipant', participant)
export const removeParticipant = (participant: Participant): Promise<void> => store.dispatch('removeParticipant', participant)
export const giveTurn = (participant: Participant): Promise<void> => store.dispatch('giveTurn', participant)
export const selectRandomParticipant = (): Promise<Participant | undefined> => store.dispatch('selectRandomParticipant')
export const clearTurns = (): Promise<void> => store.dispatch('clearTurns')
