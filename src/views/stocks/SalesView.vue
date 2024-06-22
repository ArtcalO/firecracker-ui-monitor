<script >
import { Plus, Search } from '@element-plus/icons-vue'
import ActionsMenu from '@/components/reusables/ActionsMenu.vue'
import SaleDetails from '@/components/reusables/SaleDetails.vue'
export default {
	components:{
		ActionsMenu,SaleDetails
	},
	data(){
		return {
			sales:this.$store.state.sales,
			isLoading:false,
			debt_paid:0,
			Search,
			keyword:"",
			debt_details:false,
			venteObj:{},
			detail_vente_shown:false,
			filters:{
				du:this.getToday(),au:this.getToday()
			}
		}
	},
	watch: {
	 "$store.state.sales"(new_val){
	 	this.sales=new_val
	 },
	 "keyword"(new_val){
	 	this.sales = this.$store.state.sales.filter(x =>{
        return JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
      })
	 }
	},
	mounted(){
		this.fetchSales()
	},
	methods:{
		fetchSales(){
			let du = this.getDate(this.filters.du)
			let au = this.getDate(this.filters.au)
			axios.get(`ventes/?search=${this.keyword}&created_at__gte=${du}T00:00&created_at__lte=${au}T23:59`)
			.then((res)=>{
				this.isLoading=false
				this.$store.state.sales=res.data.results
			})
			.catch((err)=>{
				this.isLoading=false
				console.log(err)
			})
		},
		validerPayementDette(){
			if(this.debt_paid==0){
				this.useNotifyError("Veuillez ajouter un montant valide")
				return
			}
			axios.post(`ventes/${this.venteObj.id}/debt-paid/`,{"paid":this.debt_paid})
			.then((res)=>{
				this.venteObj.paid=res.data.paid
				this.venteObj.in_debt=res.data.in_debt
				this.debt_paid=0
				this.debt_details=false
				this.useNotifySuccess("Dette payé avec success !")
			})
			.catch((err)=>{
				this.isLoading=false
				console.log(err)
			})
		},
		close(){
			this.venteObj={}
			this.detail_vente_shown=false
		},
		showVenteDetails(vente){
			this.venteObj=vente
			this.detail_vente_shown=true
		},
		payerDette(vente){
			this.venteObj=vente
			this.debt_details=true
		}
	}
}
</script>

<template>
	<div>
		<v-row align="center" class="my-2">
			<v-col>
				<h4 class="font-weight-medium">Ventes</h4>
				<h5 v-if="sales && sales.length>0">Total : {{ money(sales.reduce((sum, sale) => sum += sale.to_pay, 0)) }}</h5>
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
						        <el-button type="primary" @click="fetchSales"
									>Filtrer</el-button
								>
						      </el-col>
						    </el-form-item>
						</div>
						<div class="mr-sm-2 my-2 my-sm-0">
							<el-input v-model="keyword" placeholder="Chercher" class="input-with-select w-100">
								<template #append>
									<el-button type="primary" :icon="Search" @click="fetchSales" />
								</template>
							</el-input>
						</div>
					</div>
				</div>
			</template>
			<el-table v-loading="isLoading" :data="sales" style="width: 100%">
				<el-table-column label="Facture N*" width="auto">
					<template #default="scope">
						<span class="text-truncate">Facture N* {{ scope.row.id }}</span>
					</template>
				</el-table-column>
				<el-table-column label="Client" width="auto">
					<template #default="scope">
						<span class="text-truncate">
						{{ scope.row.client?scope.row.client:'-----' }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="Montant">
					<template #default="scope">
						<div>
							<span>{{ money(scope.row.to_pay) }}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Montant payé">
					<template #default="scope">
						<div>
							<span>{{ money(scope.row.paid) }}</span>
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
				<el-table-column fixed="right" label="Operations" width="120">
			      <template #default="scope">
			        <el-button type="primary" size="small" @click="showVenteDetails(scope.row)">
			          Details
			        </el-button>
			        <el-button type="danger" size="small"
			        	v-if="scope.row.in_debt"
			        	@click="payerDette(scope.row)"
			        >Payer dette</el-button>
			        <el-button type="warning" size="small"
			        	v-if="scope.row.was_in_debt"
			        	@click="$router.push({name:'histPayDebt',params:{id:scope.row.id}})"
			        >Hist dette</el-button>
			      </template>
			    </el-table-column>			
			</el-table>
		</el-card>
		<el-dialog
	        v-model="debt_details"
	        title="Confirmation !"
	        width="30%"
	      >
	        <span>Il vous reste une dette de {{ venteObj.to_pay-venteObj.paid }} ?</span>
	        <div >
	          <el-form-item label="Montant payé">
				<el-input type="number" v-model="debt_paid" name="debt_paid" />
			</el-form-item>
	        </div>
	        <template #footer>
	          <span class="dialog-footer">
	            <el-button @click="debt_details = false">Anuler</el-button>
	            <el-button :loading="isLoading" type="primary" @click="validerPayementDette">
	              Confirmer
	            </el-button>
	          </span>
	        </template>
	      </el-dialog>
		<SaleDetails v-if="detail_vente_shown" :venteProp="venteObj" @close="close" />
	</div>
</template>

<style lang="scss" scoped></style>
