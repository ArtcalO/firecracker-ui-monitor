<script >
import { useDateFormat } from '@vueuse/core'

export default{
	data(){
		return {
			confirm:"",
			isLoading:false,
			groups:[],
			outlay:{
				amount:"",
				created_at:"",
				details:"",
			},
		}
	},
	methods:{
		createOutlay(){
			if(this.outlay.amount==0){
				this.useNotifyError("Veuillez spécifier le montant de la depense !")
				return
			}
			if(this.outlay.details.trim()==""){
				this.useNotifyError("Veuillez spécifier le motif de la depense !")
				return
			}
			let data = new FormData()
			this.isLoading=true

			axios.post("depenses/", this.outlay)
			.then((res)=>{
				this.useNotifySuccess("Depense Crée avec success !")
				this.$store.state.outlays.push(res.data)
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
		<el-form label-position="top" label-width="100px" :model="outlay">
			<h5 class="border-b pb-3 mb-3">Création depense</h5>
			<el-row :gutter="20">
				<el-col :span="24" :sm="12">
					<el-form-item label="Montant">
						<el-input v-model="outlay.amount" name="amount" />
					</el-form-item>
					<el-form-item label="Motif">
						<el-input v-model="outlay.details" name="details" />
					</el-form-item>
				</el-col>
				<el-col :span="24" :sm="12">
					<el-form-item label="Date">
						<el-input type="date" v-model="outlay.created_at" name="created_at" />
					</el-form-item>		
				</el-col>
			</el-row>
			<el-button :loading="isLoading" @click="createOutlay" type="primary" size="large"
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
