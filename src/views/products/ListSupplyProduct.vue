<script >
import { Plus, Search,Upload } from '@element-plus/icons-vue'
import ActionsMenu from '@/components/reusables/ActionsMenu.vue'
export default {
	components:{
		ActionsMenu,
	},
	data(){
		return {
			supply_product:this.$store.state.supply_product,
			isLoading:false,keyword:"",Plus,Search,Upload,
			validateAchat:false,selected_achat:null,action:"",
		}
	},
	watch: {
	 "$store.state.supply_product"(new_val){
	 	this.supply_product=new_val
	 },
	 "keyword"(new_val){
	 	this.supply_product = this.$store.state.supply_product.filter(x =>{
        return JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
      })
	 }
	},
	mounted(){
		this.fetchSupply_product()
	},
	methods:{
		openConfirmation(tr){
			this.action = "valider"
			this.selected_achat=tr
			this.validateAchat=true
		},
		openCancel(tr){
			this.action = "annuler"
			this.selected_achat=tr
			this.validateAchat=true
		},
		fetchSupply_product(){
			this.isLoading=true
			axios.get('achats/?product='+this.$route.params.id)
			.then((res)=>{
				this.isLoading=false
				this.$store.state.supply_product=res.data.results
			})
			.catch((err)=>{
				this.isLoading=false
				console.log(err)
			})
		},
		performValidateAchat(){
			if(this.selected_achat==null){
				this.useNotifyError("Veuillez selectionner un achat a valider !")
				return
			}
			this.isLoading=true
			if(this.action=="valider")
				axios.get('achats/'+this.selected_achat?.id+"/validate-achat/")
				.then((res)=>{
					this.isLoading=false
					this.action=""
					this.validateAchat=false
					this.selected_achat.approved_by=res.data.approved_by
					this.useNotifySuccess("Achat validé avec succes !")
				})
				.catch((err)=>{
					this.isLoading=false
					this.errorOrRefresh(err,this.performValidateAchat)
					console.log(err)
				})
			else if(this.action="annuler")
				axios.get('achats/'+this.selected_achat?.id+"/annuler-achat/")
				.then((res)=>{
					this.isLoading=false
					this.action=""
					this.validateAchat=false
					this.useNotifySuccess("Achat annulé avec succes !")
				})
				.catch((err)=>{
					this.isLoading=false
					this.errorOrRefresh(err,this.performValidateAchat)
					console.log(err)
				})
		},
	}
}
</script>

<template>
	<div>
		<v-row align="center" class="my-2">
			<v-col cols="auto">
				<el-button type="primary" :icon="Plus" 
					@click="$router.push({
						name: 'supplyProduct',
						params: {
							id: $route.params.id
						}
					})"
					>Achat</el-button
				>
			</v-col>
			<v-col cols="auto" v-if="false">
				<el-button type="primary" :icon="Upload">
		      Inporter
		    </el-button>
			</v-col>
		</v-row>
		<el-card>
			<template #header>
				<div class="card-header d-xl-flex align-center justify-space-between">
					<div></div>
					<div class="d-md-flex align-center">
						<div class="mr-sm-2 my-2 my-sm-0">
							<el-input v-model="keyword" placeholder="Chercher" class="input-with-select w-100">
								<template #append>
									<el-button type="primary" :icon="Search" />
								</template>
							</el-input>
						</div>
					</div>
				</div>
			</template>
			<el-table v-loading="isLoading" :data="supply_product" style="width: 100%">
				<el-table-column label="Date d'achat" width="auto">
					<template #default="scope">
						<div>
							<span >{{ getDate(scope.row.created_at) }}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Quantité">
					<template #default="scope">
						<div>
							<span>{{ scope.row.quantity+' '+scope.row.product.in_unity }} / {{ scope.row.quantity*scope.row.product.rapport }} Pièce(s)</span>
						</div>
					</template>
				</el-table-column>

				<!--<el-table-column label="P.A">
					<template #default="scope">
						<div>
							<span>{{ money(scope.row.buy_price) }}</span>
						</div>
					</template>
				</el-table-column>-->

				<el-table-column label="Status">
					<template #default="scope">
					<el-tag
			        	v-if="scope.row.approved_by"
			        	type="success"
			        >Déjà validé </el-tag>
			        <el-tag
			        	v-if="!scope.row.approved_by"
			        	type="primary"
			        >Non validé</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="Actions" v-if="active_user.is_superuser">
			      <template #default="scope">
			        <el-button size="small" type="primary"
			        	v-if="!scope.row.approved_by"
			        	@click="openConfirmation(scope.row)"
			          >Valider</el-button
			        >
			        <el-button size="small" type="danger"
			        	@click="openCancel(scope.row)"
			          >Annuler</el-button
			        >
			      </template>
			    </el-table-column>			
			</el-table>
			<el-dialog
		        v-model="validateAchat"
		        title="Confirmation !"
		        width="30%"
		      >
		        <span>Voulez vous {{action}} ces achats ?</span>
		        <template #footer>
		          <span class="dialog-footer">
		            <el-button @click="validateAchat = false">Annuler</el-button>
		            <el-button :loading="isLoading" type="primary" @click="performValidateAchat">
		              Confirmer
		            </el-button>
		          </span>
		        </template>
		      </el-dialog>
		</el-card>
	</div>
</template>

<style lang="scss" scoped></style>
