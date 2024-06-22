<script >
import { Plus, Search,Upload  } from '@element-plus/icons-vue'
import ActionsMenu from '@/components/reusables/ActionsMenu.vue'
export default {
	data(){
		return {
			products:this.$store.state.products,
			isLoading:false,keyword:"",Plus,Search,Upload 
		}
	},
	components:{
		ActionsMenu
	},
	watch: {
	 "$store.state.products"(new_val){
	 	this.products=new_val
	 },
	 "keyword"(new_val){
	 	this.products = this.$store.state.products.filter(x =>{
        return JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
      })
	 }
	},
	mounted(){
		this.fetchProducts()
	},
	methods:{
		fetchProducts(){
			this.isLoading=true
			axios.get('products/')
			.then((res)=>{
				this.isLoading=false
				this.$store.state.products=res.data.results
			})
			.catch((err)=>{
				this.isLoading=false
				console.log(err)
			})
		}
	}
}
</script>

<template>
	<div>
		<v-row align="center" class="my-2">
			<v-col cols="auto">
				<el-input v-model="keyword" placeholder="Chercher" class="input-with-select w-100">
								<template #append>
									<el-button type="primary" :icon="Search" />
								</template>
							</el-input>
			</v-col>
			<v-col cols="auto">
				<el-button
					v-if="active_user.is_superuser || active_user_is('responsable')"
					type="primary" :icon="Plus"
					@click="$router.push({ name: 'createProduct' })"
					>Produit</el-button
				>
			</v-col>
		</v-row>
		<el-row >
		
			<div v-for="el in products" >
				<el-tooltip
	        class="box-item"
	        effect="dark"
	        :content="el.name"
	        placement="top"
	      >
	        <el-card shadow="hover" :body-style="{ padding: '0px', minWidth:'172.5px',maxWidth:'172.5px'}">
	        <div style="padding: 14px">
	          <span>{{truncate(el.name,15)}}</span>
	          <div class="bottom" v-if="active_user.is_superuser || active_user_is('responsable')">
	            <el-button
	            	size="small"
	            	type="info"
	            	plain
	            	@click="$router.push({
										name: 'listSupplyProduct',
										params: {
											id: el.id
										}
									})"
	            >Stock</el-button>
	            <el-button
	            	size="small"
	            	type="info"
	            	plain
	            	@click="$router.push({
										name: 'supplyProduct',
										params: {
											id: el.id
										}
									})"
	            >Approv.</el-button>
	          </div>
	        </div>
	      </el-card>

	      </el-tooltip>
		  </div>
		</el-row>
	</div>
</template>

<style scoped>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}
</style>
