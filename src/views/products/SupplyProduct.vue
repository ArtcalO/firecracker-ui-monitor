<script >
import { UploadFilled } from '@element-plus/icons-vue'
import { useDateFormat } from '@vueuse/core'

export default{
	data(){
		return {
			confirm:"",
			isLoading:false,
			produit:{},
			achat:{
				product:this.$route.params.id,
				quantity:0,
				buy_price:0,
			}
		}
	},
	components:{
		UploadFilled,
	},
    computed:{
        calcPrixTotal(){
        	return this.money((this.achat.quantity*this.produit.rapport)*this.achat.buy_price)
        },
        calcPrixVenteTotal(){
        	return this.money((this.achat.quantity*this.produit.rapport)*this.achat.sale_price)
        },
        quantityLabel(){
        	return 'Quantité(s) en '+this.produit.in_unity
        },
    },
    beforeMount(){
    	 axios.get(`products/${this.$route.params.id}/`)
	        .then((response) => {
	        	this.produit=response.data
	        }).catch((error)=>{
	            console.log(error)
	        })
    },
	methods:{
        ajouterAchat(){
	        if(!this.achat.quantity){
	            this.useNotifyError("pas de quantité !")

	            return;
	        }
	        this.isLoading=true
	        axios.post(`achats/`, this.achat)
	        .then((response) => {
	        	this.isLoading=false
	            this.achat = {}
	            this.$router.go(-1)
	            this.useNotifySuccess("Achat ajouté avec succes !")
	        }).catch((error)=>{
	        	this.isLoading=false
	            console.log(error)
	        })
        },
	}
}

</script>

<template>
	<el-card>
		<el-form label-position="top" label-width="100px" :model="achat">
			<h5 class="border-b pb-3 mb-3">Achat du produit : <span>{{produit?.name}}</span></h5>
			<el-row :gutter="20">
				<el-col :span="24" :sm="12">
					<el-form-item
						:label="quantityLabel">
						<el-input v-model="achat.quantity" name="quantity" />
					</el-form-item>
					<p>{{ achat.quantity*produit.rapport }} pieces</p>
					<!--<el-form-item label="Prix Achat Unitaire">
						<el-input v-model="achat.buy_price" name="buy_price"
						/>
					</el-form-item>-->
				</el-col>
			</el-row>
			<el-button :loading="isLoading" @click="ajouterAchat" type="primary" size="large"
				>Enregistrer</el-button
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
span{
	color:blue;
}
</style>
