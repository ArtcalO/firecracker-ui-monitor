<script >
import { Plus, Search,Upload  } from '@element-plus/icons-vue'
import ActionsMenu from '@/components/reusables/ActionsMenu.vue'
import CartView from '@/components/reusables/CartView.vue'
export default {
	data(){
		return {
			main_stocks:this.$store.state.main_stocks,
			isLoading:false,keyword:"",Plus,Search,Upload,
      cart:this.$store.state.cart,
		}
	},
	components:{
		ActionsMenu,CartView
	},
	watch: {
	 "$store.state.main_stocks"(new_val){
	 	this.main_stocks=new_val
	 },
	 "keyword"(new_val){
	 	this.main_stocks = this.$store.state.main_stocks.filter(x =>{
        return JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
      })
	 }
	},
	mounted(){
		this.fetchmain_stocks()
	},
	methods:{
		getBackGroundColor(qt){
			if(qt<=0) return 'red'
			if(qt>0 && qt <5) return 'orange'
			else return 'white'
		},
		displayProduct(el){
			let in_unity = el.quantity/el.product.rapport
			in_unity=""+in_unity
			if(in_unity.includes(".")){
				return `${el.product.in_unity} ${in_unity.split(".")[0]} et ${in_unity.split(".")[1]} ${el.product.out_unity}`
			}else{
				return `${el.product.in_unity} ${in_unity}`
			}
		},
		fetchmain_stocks(){
			this.isLoading=true
			axios.get('main-stocks/')
			.then((res)=>{
				this.isLoading=false
				this.$store.state.main_stocks=res.data.results
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
			<v-col :cols="8">
				<el-input v-model="keyword" placeholder="Chercher" class="input-with-select w-100">
								<template #append>
									<el-button type="primary" :icon="Search" />
								</template>
							</el-input>
			</v-col>
		</v-row>
		<el-row >
			<div v-for="el in main_stocks" >
				<el-tooltip
	        class="box-item"
	        effect="dark"
	        :content="el.product.name"
	        placement="top"
	      >
	        <el-card
            shadow="hover"
            @click="el.quantity>0?cart.addItem(el):null"
            :body-style="{ padding: '0px', minWidth:'172.5px',maxWidth:'172.5px', backgroundColor:getBackGroundColor(el.quantity)}"
          >
          <div class="producty-image-display">
              <div>
                <img
                :src="el.product.image"
                style="width: 30px"
              />
            </div>
		        <div>
		          <span>{{truncate(el.product.name,12)}}</span>
		          <div class="bottom">
		            <p class="time">Qt : {{getRemainPackage(el.quantity,el.product.rapport)}} {{el.product.in_unity}}(s)</p>
		            <p class="time">Qt. Details : {{el.quantity}} {{el.product.out_unity}} pce(s)</p>
		          </div>
		        </div>
          </div>

	      </el-card>

	      </el-tooltip>
		  </div>
		</el-row>
    <CartView @close="fetchmain_stocks"/>
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
  flex-direction:column;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}
p{
	margin-bottom:2px;
}

.producty-image-display{
	display:flex;
	flex-direction:row;
	justify-content:space-between;
}

.producty-image-display div:first-child{
	margin-right:20px;
	width:20%;
}

.producty-image-display div:last-child{
	width:80%;
}
</style>
