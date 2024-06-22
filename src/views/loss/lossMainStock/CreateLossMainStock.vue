Create<script >
import { useDateFormat } from '@vueuse/core'

export default{
	data(){
		return {
			confirm:"",
			isLoading:false,
			shopStock:[],
			rapport_shown:false,
			loss:{
				stock:"",
				quantity:0,
				details:"",
				loss_unity:"piece",
				rapport:1,
				getRapportLabel:"",
				created_at:this.currentDateTime(),
			},
		}
	},
	beforeMount(){
		this.fetchShopStock()
	},
	watch: {
		"loss.loss_unity":{
	      deep:true,
	      handler(new_val){
	        if(new_val=="carton"){
	        	this.rapport_shown=true
	        	this.getRapportLabel="1 carton vaut combien de piece ? ex 1 carton = 12 piece"
	        }
	      }
		},
	},
	computed: {
	  quantityLabel() {
	    return "Quantité perdu en "+this.loss.loss_unity;
	  },
	},
	methods:{
		fetchShopStock(){
			this.isLoading=true
			axios.get('main-stocks/?quantity__gte=0')
			.then((res)=>{
				this.isLoading=false
				this.shopStock=res.data.results
			})
			.catch((err)=>{
				this.isLoading=false
				console.log(err)
			})
		},
		createloss(){
			if(this.loss.quantity==0){
				this.useNotifyError("Veuillez spécifier la quantité perdu !")
				return
			}
			if(this.loss.loss_unity=="carton" && this.loss.rapport==1){
				this.useNotifyError("Veuillez spécifier le rapport (nombre de peice dans un carton !)")
				return
			}

			this.isLoading=true

			axios.post("loss-main-stock/", this.loss)
			.then((res)=>{
				this.useNotifySuccess("Perte Crée avec success !")
				this.$store.state.lossShop.push(res.data)
				this.$router.go(-1)
			})
			.catch((err)=>{
				this.isLoading=false
				console.log(err)
				this.useNotifyError("Une erreur s'est produite !")
			}).finally(()=>this.isLoading=false)


		}
	}
}

</script>

<template>
	<el-card>
		<el-form label-position="top" label-width="100px" :model="loss">
			<h5 class="border-b pb-3 mb-3">Création Casse ou perte</h5>
			<el-row :gutter="20">
				<el-col :span="24" :sm="12">
					<el-form-item label="Produit">
						<el-select filterable v-model="loss.stock" placeholder="Select" class="w-100">
							<el-option
								v-for="item in shopStock"
								:key="item.id"
								:label="item.product.name"
								:value="item.id"
							/>
						</el-select>
					</el-form-item>
					<el-form-item label="Unité perdue">
						<el-select filterable v-model="loss.loss_unity" placeholder="Select" class="w-100">
							<el-option
								label="Piece"
								value="piece"
							/>
							<el-option
								label="Carton"
								value="carton"
							/>
						</el-select>
					</el-form-item>
					<el-form-item :label="getRapportLabel" v-if="rapport_shown">
						<el-input :placeholder="getRapportLabel" type="number" v-model="loss.rapport" name="rapport" />
					</el-form-item>
					<el-form-item :label="quantityLabel">
						<el-input type="number" v-model="loss.quantity" name="quantity" />
					</el-form-item>

				</el-col>
				<el-col :span="24" :sm="12">
					<el-form-item label="Date">
					 	<el-date-picker
                            v-model="loss.created_at"
                            type="datetime"
                            placeholder="Choisir une date"
                            class="w-100"
                            :shortcuts="shortcuts"
                            :disabled-date="disabledDate"
                        />
					</el-form-item>
				</el-col>
			</el-row>
			<el-button :loading="isLoading" @click="createloss" type="primary" size="large"
				>Valider</el-button
			>
		</el-form>
	</el-card>
</template>

<style scoped>
.drop-area {
	text-align: center;
	padding: 20px;
	background-color: #f1f1f1;
	border: 2px dashed #ccc;
	cursor: pointer;
}

.drag-over {
	background-color: #c1c1c1;
}

.dropzone-text {
	padding: 10px;
}

img {
	max-width: 100%;
	max-height: 115px;
}
</style>
