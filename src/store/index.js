import { createStore } from 'vuex'

export default createStore({
  state: {
    user:null,
    url:"/api",
    rail:false,

    active:'0',

    users:[],
    appName:"GURU-FIRECRACKER",
    products:[],
    supply_product:[],
    outlays:[],
    main_stocks:[],
    lossShop:[],
    lossMainStock:[],
    tr_stock:[],
    cart_visible:false,
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
