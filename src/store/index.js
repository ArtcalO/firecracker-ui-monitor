import { createStore } from 'vuex'

export default createStore({
  state: {
    user:null,
    url:"/api",
    rail:false,

    active:'0',

    users:[],
    appName:"GURU-FIRECRACKER",
    OSes:[],
    root_files:[],
    iso_files:[],
  },
  computed: {
    accessToken() {
      return user.access
    },
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
