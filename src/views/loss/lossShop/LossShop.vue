<script >
import { Plus, Search } from '@element-plus/icons-vue'
export default {
  data(){
    return {
      lossShop:this.$store.state.lossShop,
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
   "$store.state.lossShop"(new_val){
    this.lossShop=new_val
   },
   "keyword"(new_val){
    this.lossShop = this.$store.state.lossShop.filter(x =>{
        return JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
      })
   }
  },
  mounted(){
    this.fetcLossShop()
  },
  methods:{
    fetcLossShop(){
      let du = this.getDate(this.filters.du)
      let au = this.getDate(this.filters.au)
      axios.get(`loss-shop/?search=${this.keyword}&created_at__gte=${du}T00:00&created_at__lte=${au}T23:59`)
      .then((res)=>{
        this.isLoading=false
        this.$store.state.lossShop=res.data.results
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
        <h4 class="font-weight-medium"></h4>
      </v-col>
      <v-col cols="auto">
        <el-button
          type="primary" :icon="Plus"
          @click="$router.push({ name: 'createLossShop' })"
          >Casse</el-button
        >
      </v-col>
    </v-row>

    <el-card>
      <template #header>
        <div class="card-header d-xl-flex align-center justify-space-between">
          <div class="d-md-flex ">
            <div class="mr-sm-2 my-2 my-sm-0">
              <el-form-item >
              <el-col :span="2" class="text-center">
                    <span class="text-gray-500">Du: </span>
                  </el-col>
                  <el-col :span="7">
                    <el-date-picker
                      v-model="filters.du"
                      type="date"
                      placeholder="Pick a date"
                      style="width: 100%"
                    />
                  </el-col>
                  <el-col :span="2" class="text-center">
                    <span class="text-gray-500">Au : </span>
                  </el-col>
                  <el-col :span="7">
                    <el-date-picker
                      v-model="filters.au"
                      type="date"
                      placeholder="Pick a date"
                      style="width: 100%"
                    />
                  </el-col>
                   <el-col :span="1" class="text-center">
                  </el-col>
                  <el-col :span="4">
                    <el-button type="primary" @click="fetcLossShop"
                  >Filtrer</el-button
                >
                  </el-col>
                </el-form-item>
            </div>
            <div class="mr-sm-2 my-2 my-sm-0">
              <el-input v-model="keyword" placeholder="Chercher" class="input-with-select w-100">
                <template #append>
                  <el-button type="primary" :icon="Search" @click="fetcLossShop" />
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </template>
      <el-table v-loading="isLoading" :data="lossShop" style="width: 100%">
        <el-table-column label="Casse N*" width="auto">
          <template #default="scope">
            <span class="text-truncate">Casse N* {{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Quantité" width="auto">
          <template #default="scope">
            <span class="text-truncate">
            {{ scope.row.quantity }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Utlisateur">
          <template #default="scope">
            <div>
              <span>{{ scope.row.created_by.fullname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Date">
          <template #default="scope">
            <div>
              <span>{{ datetime(scope.row.created_at) }}</span>
            </div>
          </template>
        </el-table-column> 
      </el-table>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
