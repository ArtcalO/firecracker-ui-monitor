<script >
import { Plus, Search } from '@element-plus/icons-vue'
export default {
  data(){
    return {
      root_files:this.$store.state.root_files,
      isLoading:false,keyword:"",
      Search,Plus,
      osObj:{},
      os_shown:false,
    }
  },
  watch: {
   "$store.state.root_files"(new_val){
    this.root_files=new_val
   },
   "keyword"(new_val){
    this.root_files = this.$store.state.root_files.filter(x =>{
        return JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
      })
   }
  },
  mounted(){
    this.fetcRootFiles()
  },
  methods:{
    fetcRootFiles(){
      axios.get(`root_files/?search=${this.keyword}`)
      .then((res)=>{
        this.isLoading=false
        this.$store.state.root_files=res.data
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
        <h4 class="font-weight-medium">VMs</h4>
      </v-col>
      <v-col cols="auto">
        <el-button
          type="primary" :icon="Plus"
          @click="$router.push({ name: 'createVM' })"
          >VM</el-button
        >
      </v-col>
    </v-row>

    <el-card>
      <template #header>
        <div class="card-header d-xl-flex align-center justify-space-between">
          <div class="d-md-flex ">
            <div class="mr-sm-2 my-2 my-sm-0">
              <el-input v-model="keyword" placeholder="Chercher" class="input-with-select w-100">
                <template #append>
                  <el-button type="primary" :icon="Search" @click="fetcRootFiles" />
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </template>
      <el-table v-loading="isLoading" :data="root_files" style="width: 100%">
        <el-table-column label="N*" width="auto">
          <template #default="scope">
            <span class="text-truncate">N* {{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Nom du root file" width="auto">
          <template #default="scope">
            <span class="text-truncate">
            {{ scope.row.name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="OS Associe" width="auto">
          <template #default="scope">
            <span class="text-truncate">
            {{ scope.row.os_id.name}}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
