import { createStore } from 'vuex'

export default createStore({
  state: {
    user:null,
    url:"/api",
    rail:false,

    active:'0',

    users:[],
    appName:"K-SHOP",
    products:[],
    supply_product:[],
    outlays:[],
    main_stocks:[],
    lossShop:[],
    lossMainStock:[],
    tr_stock:[],
    cart_visible:false,
    cart:new Object({
      content: [],
      findIndex(id){
        return this.content.findIndex(x=> x.stock_id==id)
      },
      augmenter(id){
        let idx = this.findIndex(id)
        if(idx>-1 && this.content[idx].init_quantity>this.content[idx].quantity)
          this.content[idx].quantity+=1
        if(this.content[idx].quantity > this.content[idx].init_quantity)
          this.content[idx].quantity=this.content[idx].init_quantity
      },
      getTotal(){
        let tot = 0;
        for (let i = 0; i < this.content.length; i++) {
          tot += this.content[i].quantity*this.content[i].sale_price;
        }
        return tot;
      },
      checkNullPrices(){
        let tot = 0;
        for (let i = 0; i < this.content.length; i++) {
          if(this.content[i].quantity<=0 || this.content[i].sale_price<=0)
            return true
        }
        return false
      },
      diminuer(id){
        let idx = this.findIndex(id)
        if(idx >-1 && this.content[idx].quantity >0 )
          this.content[idx].quantity-=1
        if(this.content[idx].quantity < 0)
          this.content[idx].quantity=0
      },
      removeItem(id){
        let idx = this.findIndex(id)
        if(idx >-1)
          this.content.splice(idx,1)
      },
      emptyCart(){
        this.content=[]
      },
      addNewItem(item){
        this.content.push({
            "stock_id":item.id,
            'product_name':item.product.name,
            'product_unity':item.product.in_unity,
            'product_rapport':item.product.rapport,
            'sale_price':item.sale_price,
            'init_quantity':item.quantity,
            "quantity":1
          })
      },
      addItem(item){
        if(this.content.length==0){
          this.addNewItem(item)
        }else{
          let index_produit = this.findIndex(item.id)
          if(index_produit>-1){
            this.content[index_produit].quantity+=1
          }else{
            this.addNewItem(item)
          }
        }
      },
    
    }),
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
