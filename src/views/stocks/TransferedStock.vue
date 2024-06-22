<script >
import { Plus, Search,Upload } from '@element-plus/icons-vue'
import ActionsMenu from '@/components/reusables/ActionsMenu.vue'
import TransfertDetails from '@/components/reusables/TransfertDetails.vue'
export default {
	components:{
		ActionsMenu,TransfertDetails
	},
	data(){
		return {
			validateTransfert:false,
			selected_tr:null,
			transfertDetailsObj:null,
			detail_tr_shown:false,
			action:"",
			tr_stock:this.$store.state.tr_stock,
			isLoading:false,keyword:"",Plus,Search,Upload
		}
	},
	watch: {
	 "$store.state.tr_stock"(new_val){
	 	this.tr_stock=new_val
	 },
	 "keyword"(new_val){
	 	this.tr_stock = this.$store.state.tr_stock.filter(x =>{
        return JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
      })
	 }
	},
	mounted(){
		this.fetchTrStock()
	},
	methods:{
		openConfirmation(tr){
			this.action = "valider"
			this.selected_tr=tr
			this.validateTransfert=true
		},
		openCancel(tr){
			this.action = "annuler"
			this.selected_tr=tr
			this.validateTransfert=true
		},
		openDetailsTransfert(transfert){
			this.transfertDetailsObj=transfert
			this.detail_tr_shown=true
		},
		close(){
			this.validateTransfert=false
			this.detail_tr_shown=false
		},
		performValidateTransfert(){
			if(this.selected_tr==null){
				this.useNotifyError("Veuillez selectionner un transfert a valider !")
				return
			}
			this.isLoading=true
			if(this.action=="valider")
				axios.get('transfert-stocks/'+this.selected_tr?.id+"/validate-transfert/")
				.then((res)=>{
					this.isLoading=false
					this.action=""
					this.selected_tr.received_by=res.data.received_by
					this.validateTransfert=false
					this.useNotifySuccess("Transfert validé avec success !")
				})
				.catch((err)=>{
					this.isLoading=false
					this.errorOrRefresh(err,this.performValidateTransfert)
					console.log(err)
				})
			else if(this.action="annuler")
				axios.get('transfert-stocks/'+this.selected_tr?.id+"/annuler-transfert/")
				.then((res)=>{
					this.isLoading=false
					this.action=""
					this.selected_tr.canceled_by=res.data.canceled_by
					this.validateTransfert=false
					this.useNotifySuccess("Transfert annulé avec success !")
				})
				.catch((err)=>{
					this.isLoading=false
					this.errorOrRefresh(err,this.performValidateTransfert)
					console.log(err)
				})
		},
		fetchTrStock(){
			this.isLoading=true
			axios.get('transfert-stocks/')
			.then((res)=>{
				this.isLoading=false
				this.$store.state.tr_stock=res.data.results
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
			<el-table v-loading="isLoading" :data="tr_stock" style="width: 100%">
				<el-table-column label="Date de transfert" width="auto">
					<template #default="scope">
						<div>
							<span >{{ datetime(scope.row.created_at) }}</span>
						</div>
					</template>
				</el-table-column>
				<!--<el-table-column label="Montant total2" width="auto">
					<template #default="scope">
						<div>
							<span >{{ money(scope.row.amount) }}</span>
						</div>
					</template>
				</el-table-column>-->
				<el-table-column label="Actions">
			      <template #default="scope">
			        <el-button size="small" type="primary"
			        	v-if="!scope.row.received_by &&  active_user_is('boutiquier')"
			        	@click="openConfirmation(scope.row)"
			          >Valider</el-button
			        >
			        <el-button size="small" type="danger"
			        	v-if="!scope.row.received_by &&  active_user_is('boutiquier')"
			        	@click="openCancel(scope.row)"
			          >Annuler</el-button
			        >
			        <el-tag
			        	v-if="!scope.row.received_by && !active_user_is('boutiquier')"
			        	type="danger"
			        >Pas encore reçu </el-tag>
			        <el-tag
			        	v-if="scope.row.canceled_by"
			        	type="danger"
			        >Annulé</el-tag>
			        <el-tag
			        	v-if="scope.row.received_by"
			        	type="success"
			        >Déjà reçu </el-tag>
			      </template>
			    </el-table-column>
			    <el-table-column label="Actions">
			      <template #default="scope">
			        <el-button size="small" type="primary"
			        	@click="openDetailsTransfert(scope.row)"
			          >Details</el-button
			        >
			      </template>
			    </el-table-column>		
			</el-table>
			<el-dialog
		        v-model="validateTransfert"
		        title="Confirmation !"
		        width="30%"
		      >
		        <span>Voulez vous {{action}} la reception des marchandises ?</span>
		        <!--<div>
		          <span class="tag-group__title m-1 line-height-2">Montant total des marchandises: </span>
		          <el-tag class="ml-2" size="large" type="success">{{money(selected_tr.amount)}} BIF</el-tag>
		        </div>-->
		        <template #footer>
		          <span class="dialog-footer">
		            <el-button @click="validateTransfert = false">Anuler</el-button>
		            <el-button :loading="isLoading" type="primary" @click="performValidateTransfert">
		              Confirmer
		            </el-button>
		          </span>
		        </template>
		      </el-dialog>
		</el-card>
		<TransfertDetails v-if="detail_tr_shown" :transfertDetailsProps="transfertDetailsObj" @close="close" />
	</div>
</template>

<style lang="scss" scoped></style>
