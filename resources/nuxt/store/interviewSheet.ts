export const state = () => ({
  data: []
})

export const mutations = {
  setData(state: any, data: any) {
    state.data = data
  }
}

export const actions = {
  async getInterviewSheet(commit: any) {
    await this.$axios.$get('/api/interview').then((response: any) => {
      commit.commit('setData', response)
    })
  }
}
