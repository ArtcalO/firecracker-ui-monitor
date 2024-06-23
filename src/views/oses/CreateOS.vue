<script >
import { useDateFormat } from '@vueuse/core'

export default{
	data(){
		return {
			isLoading:false,
			os:{
				name:"",
			},
		}
	},
	methods:{
		createOS(){
			if(this.os.name.trim()==""){
				this.useNotifyError("Veuillez spécifier le nom de l' OS")
				return
			}
			axios.post("oses/", this.os)
			.then((res)=>{
				this.useNotifySuccess("Os Crée avec success !")
				this.$store.state.oses.push(res.data)
				this.$router.go(-1)
			})
			.catch((err)=>{
				this.isLoading=false
				console.log(err)
				this.errorOrRefresh(err, this.createOS)
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
					<el-form-item label="NOm de l' os">
						<el-input v-model="os.name" name="name" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-button :loading="isLoading" @click="createOS" type="primary" size="large"
				>VAlider</el-button
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
