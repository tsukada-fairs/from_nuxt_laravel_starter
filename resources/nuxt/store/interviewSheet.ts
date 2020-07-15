// export const state = () => ({
//   data: []
// })

// export const mutations = {
//   setData(state: any, data: any) {
//     state.data = data
//   }
// }

// export const actions = {
//   async getInterviewSheet(commit: any) {
//     await this.$axios.$get('/api/interview').then((response: any) => {
//       commit.commit('setData', response)
//     })
//   }
// }

import { getterTree, mutationTree, actionTree } from 'typed-vuex'

export type RootState = ReturnType<typeof state>

export const state = () => ({
  data: []
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setData (state: any, data: any) {
    state.data = data
  }
})

export const actions = actionTree({ state, getters, mutations }, {
  async getInterviewSheet ({getters, commit}) {
    await this.$axios
        .$get("/api/interview")
        .then((response: any) => {
          commit("setData", response);
        });
  }
})