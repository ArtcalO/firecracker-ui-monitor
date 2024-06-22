<script >
import { Plus, Search } from '@element-plus/icons-vue'
export default {
  data(){
    return {
      saleDebts:this.$store.state.saleDebts,
      isLoading:false,keyword:"",
      Search,
      venteObj:{},
      detail_vente_shown:false,
      filters:{
        du:this.getToday(),au:this.getToday()
      }
    }
  },
  watch: {
   "$store.state.saleDebts"(new_val){
    this.saleDebts=new_val
   },
   "keyword"(new_val){
    this.saleDebts = this.$store.state.saleDebts.filter(x =>{
        return JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
      })
   }
  },
  mounted(){
    this.fetcSaleDebts()
  },
  methods:{
    fetcSaleDebts(){
      axios.get(`pay-debt/?sale=${this.$route.params.id}`)
      .then((res)=>{
        this.isLoading=false
        this.$store.state.saleDebts=res.data.results
      })
      .catch((err)=>{
        this.isLoading=false
        console.log(err)
      })
    },
  }
}
</script>

<template>
  <div>
    <v-row align="center" class="my-2">
      <v-col>
        <h4 class="font-weight-medium">Remboursement dettes</h4>
      </v-col>
    </v-row>

    <el-card>
      <el-table v-loading="isLoading" :data="saleDebts" style="width: 100%">
       <el-table-column label="Date">
          <template #default="scope">
            <div>
              <span>{{ datetime(scope.row.created_at) }}</span>
            </div>
          </template>
        </el-table-column> 
        <el-table-column label="Montant qui restait" width="auto">
          <template #default="scope">
            <span class="text-truncate">
            {{ scope.row.remain_to_pay }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Montant remboursé">
          <template #default="scope">
            <div>
              <span>{{ scope.row.paid }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
