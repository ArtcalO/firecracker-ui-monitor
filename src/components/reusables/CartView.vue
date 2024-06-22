<script >
  import { CircleCloseFilled, Plus,Minus,Delete } from '@element-plus/icons-vue'
  export default{
    data(){
      return{
        cart:this.$store.state.cart,
        Plus,Minus,Delete,
        btn:"Valider",
        createVente:false,
        transfertService:false,
        isLoading:false,
        transfertShop:false,
        paid:0,
        client:null,
        form:{
          service:""
        },
        patients_results:[],
        id_patient:"",
        selected_patient:null,
        patients_result_shown:false,
      }
    },
    components:{CircleCloseFilled},
    methods: {
      init(){
        this.transfertService = false
        this.isLoading = false
        this.transfertShop = false
        this.$store.state.cart_visible = false
        this.$emit("close")
      },
      fetchService(){
          this.transfertService=true
          this.isLoading=true
            axios.get('services/')
            .then((res)=>{
                this.isLoading=false
                this.$store.state.services=res.data.results
            })
            .catch((err)=>{
                this.isLoading=false
                console.log(err)
            })
      },
      fetchPatients(){
        if(!this.id_patient){
          this.useNotifyError("Veuillez selectionner un patient!")
          return
        }
        this.isLoading=true
        axios.get(`patients/?search=${this.id_patient}`)
        .then((res)=>{
          this.patients_result_shown=true
          this.patients_results=res.data.results
        })
        .catch((err)=>{
          this.useNotifyError("Une erreur s'est produite !")
        }).finally(()=>this.isLoading=false)
      },
      vendreMedicaments(){
          if(this.cart.checkNullPrices()){
            this.useNotifyError("Rassurez vous que vous avez ajouté toutes les prix !")
            return
          }
          if(this.cart.content.length==0){
            this.useNotifyError("Rassurez vous que vous avez des éléments dans le panier !")
            return
          }
          this.createVente=true
      },
      validateTransfert(){
        let data = {
          "service_id":this.form.service,
          "total":this.cart.getTotal(),
          "items":this.cart.content
        }
        this.isLoading=true
          axios.post('pharmacie/commad-stock-service/', data)
          .then(()=>{
              this.useNotifySuccess("Stock transferé avec succes !")
              this.cart.emptyCart()
              this.init()
          })
          .catch((err)=>{
              this.isLoading=false
              console.log(err)
          })
      },
      validateVente(){
        if(this.paid==0){
          this.useNotifyError("Veuillez ajouter le montant payé !")
          return
        }
        let data = {
          "to_pay":this.cart.getTotal(),
          "paid":this.paid,
          "items":this.cart.content
        }
        if(!!this.client) data.client=this.client
        this.isLoading=true
          axios.post('ventes/', data)
          .then(()=>{
              this.useNotifySuccess("Vente effectué avec succes !")
              this.cart.emptyCart()
              this.init()
          })
          .catch((err)=>{
              this.isLoading=false
              console.log(err)
          })
      },
      handleCurrentChange(patient){
        this.selected_patient=patient
        this.patients_result_shown=false
      },
      transfertItemsToShop(){
        let data = {
          "total":this.cart.getTotal(),
          "items":this.cart.content
        }
        this.isLoading=true
          axios.post('transfert-stocks/', data)
          .then(()=>{
              this.useNotifySuccess("Stock transferé vers le comptoir avec success !")
              this.isLoading=false
              this.cart.emptyCart()
              this.init()
          })
          .catch((err)=>{
              this.isLoading=false
              console.log(err)
          })
      },
    },
    watch: {
      "$store.state.cart_visible"(new_val){
          this.$store.state.cart_visible=new_val
      },
    },
  }
</script>

<template>
  <div >
    <el-drawer v-model="cart_visible" modal="false" :show-close="false" size="45z%">
      <template #header="{ close, titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass">Panier</h4>
        <el-button type="danger" @click="$store.state.cart_visible=false">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          Close
        </el-button>
      </template>

      <el-table :data="cart.content" direction="rtl" size="60%">
      <el-table-column width="45">
          <template #default="scope">
            <el-button type="danger" @click="cart.removeItem(scope.row.stock_id)" :icon="Delete" circle />
          </template>
        </el-table-column>
        <el-table-column property="product_name" label="Produit" width="150" />
        <el-table-column width="45">
          <template #default="scope" >
            <el-button type="danger" @click="cart.diminuer(scope.row.stock_id)" :icon="Minus" circle />
          </template>
        </el-table-column>
        <el-table-column  label="Qt. Details" width="120">
          <template #default="scope">
            <el-input v-model="scope.row.quantity" type="number" min="0" :max="scope.row.init_quantity" placeholder="" />
          </template>
        </el-table-column>
        <el-table-column width="45">
          <template #default="scope">
            <el-button type="primary" @click="cart.augmenter(scope.row.stock_id)" :icon="Plus" circle />
          </template>
        </el-table-column>
        <el-table-column  label="PU" width="120" v-if="$route.name!='mainStock'">
          <template #default="scope">
            <el-input v-model="scope.row.sale_price" type="number" placeholder="" />
          </template>
        </el-table-column>

        <el-table-column label="P.T" width="150" v-if="$route.name!='mainStock'">
          <template #default="scope">
            <span>{{scope.row.quantity*scope.row.sale_price}}</span>
          </template>
        </el-table-column>
        
      </el-table>
      <el-divider></el-divider>
      <div v-if="$route.name!='mainStock'" >
        <span class="tag-group__title m-1 line-height-2">Total : </span>
        <el-tag class="ml-2" size="large" type="success">{{money(cart.getTotal())}}</el-tag>
      </div>
      <template #footer>
      <div style="flex: auto">
        <el-button type="danger" @click="$store.state.cart.emptyCart()">Efacer Panier</el-button>
        <el-button
          type="primary"
          @click="transfertShop=true"
          v-if="$route.name=='mainStock'"
        >Transfert Vers Boutique</el-button>

        <el-button
          type="primary"
          @click="vendreMedicaments"
          v-if="$route.name=='shopStock' && !active_user_is('dacs','cpharm')"
        >Vendre</el-button>
      </div>
    </template>

      <el-dialog v-model="createVente" title="Valider vente" draggable>
        <el-form :model="form">
          <el-form-item label="Montant payé :">
            <el-input v-model="paid" name="paid" />
          </el-form-item>
          <el-form-item label="Le client :">
            <el-input v-model="client" name="client" />
          </el-form-item>
        </el-form>
        <p
          v-if="cart.getTotal()-paid>0"
        >Il manque :{{money(cart.getTotal()-paid)}} BIF</p>
        <p
          v-if="cart.getTotal()-paid<0"
        >A rembourser :{{money(paid-cart.getTotal())}} BIF</p>
        <el-divider></el-divider>

        <div>
          <span class="tag-group__title m-1 line-height-2">Total : </span>
          <el-tag class="ml-2" size="large" type="success">{{money(cart.getTotal())}} BIF</el-tag>
        </div>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="createVente = false">Annuler</el-button>
            <el-button type="primary" :loading="isLoading" @click="validateVente">
              Valider Vente
            </el-button>
          </span>
        </template>

      </el-dialog>

      <el-dialog
        v-model="transfertShop"
        title="Confirmation !"
        width="30%"
      >
        <span>Voulez vous effectuer ce transfert vers la boutique ?</span>
        <div v-if="$route.name!='mainStock'">
          <span class="tag-group__title m-1 line-height-2">Montant total des marchandises: </span>
          <el-tag class="ml-2" size="large" type="success">{{money(cart.getTotal())}} BIF</el-tag>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="transfertShop = false">Anuler</el-button>
            <el-button :loading="isLoading" type="primary" @click="transfertItemsToShop">
              Confirmer
            </el-button>
          </span>
        </template>
      </el-dialog>

    </el-drawer>
  </div>
</template>