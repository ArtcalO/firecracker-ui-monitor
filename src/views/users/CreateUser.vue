<script >
import { UploadFilled } from '@element-plus/icons-vue'
import { useDateFormat } from '@vueuse/core'

export default{
	data(){
		return {
			confirm:"",
			isLoading:false,
			btn:"Ajouter",
			groups:[],
			user:{
				last_name:"",
				first_name:"",
				username:"",
				password:"",
				groups:[],
			},
		}
	},
	components:{
		UploadFilled,
	},
	beforeMount(){
		this.fetchGroups()
	},
	mounted(){
		if(this.$route.params.id){
			this.btn="Modifier"
			this.fetchUser()
		}
	},
	methods:{
		fetchGroups(){
			axios.get(`groups/`)
				.then((response) => {
					this.groups=response.data.results
			}).catch((error) => {
				this.errorOrRefresh(error, this.fetchGroups)
			});
		},
		fetchUser(){
			axios.get(`users/${this.$route.params.id}/`)
				.then((response) => {
					this.user.last_name=response.data.last_name
					this.user.first_name=response.data.first_name
					this.user.username=response.data.username
			}).catch((error) => {
				this.errorOrRefresh(error, this.fetchUser)
			});
		},
		createUser(){
			if(this.confirm != this.user.password){
				this.useNotifyError("Mot de passe non identique !")
				return
			}
			if(this.user.groups.length==0){
				this.useNotifyError("Veuillez spécifier son rôle !")
				return
			}
			if(this.user.username.trim()==0){
				this.useNotifyError("Veuillez spécifier le nom d'utilisateur !")
				return
			}
			if(this.user.first_name.trim()==0){
				this.useNotifyError("Veuillez spécifier le Prénom de l'Utilisateur !")
				return
			}
			if(this.user.last_name.trim()==0){
				this.useNotifyError("Veuillez spécifier le Nom de l'Utilisateur !")
				return
			}
			let data = new FormData()
			this.isLoading=true
			
			data.append("last_name",this.user.last_name)
			data.append("first_name",this.user.first_name)
			data.append("username",this.user.username)
			data.append("password",this.user.password)
			data.append("groups",[this.user.groups])
			
			if(!this.$route.params.id)
				axios.post("users/", data)
				.then((res)=>{
					this.useNotifySuccess("Utilisateur Crée avec success !")
					this.$store.state.users.push(res.data)
					this.$router.go(-1)
				})
				.catch((err)=>{
					this.isLoading=false
					console.log(err)
					this.useNotifyError("Une erreur s'est produite !")
				}).finally(()=>this.isLoading=false)
			else
				axios.patch("users/"+this.$route.params.id+"/", data)
				.then((res)=>{
					this.useNotifySuccess("Utilisateur Modifiée avec success !")
					this.$router.go(-1)
				})
				.catch((err)=>{
					this.isLoading=false
					this.errorOrRefresh(err,this.createUser)
				}).finally(()=>this.isLoading=false)

		}
	}
}

</script>

<template>
	<el-card>
		<el-form label-position="top" label-width="100px" :model="user">
			<h5 class="border-b pb-3 mb-3">Informations de l'Utilisateur</h5>
			<el-row :gutter="20">
				<el-col :span="24" :sm="12">
					<el-form-item label="Nom d'utilisateur">
						<el-input v-model="user.username" name="username" />
					</el-form-item>
					<el-form-item label="Nom">
						<el-input v-model="user.first_name" name="first_name" />
					</el-form-item>
					<el-form-item label="Prénom">
						<el-input v-model="user.last_name" name="last_name" />
					</el-form-item>
				</el-col>
				<el-col :span="24" :sm="12">
					<el-form-item label="Mot de passe'">
						<el-input v-model="user.password" type="password" show-password name="Mot de passe" />
					</el-form-item>
					<el-form-item label="Confirmer mot de passe">
						<el-input v-model="confirm" name="confirm" type="password" show-password />
					</el-form-item>
					<el-form-item label="Role">
						<el-select filterable v-model="user.groups" placeholder="Select" class="w-100">
							<el-option
								v-for="item in groups"
								:key="item?.id"
								:label="item?.name"
								:value="item?.id"
							/>
						</el-select>
					</el-form-item>			
				</el-col>
			</el-row>
			<el-button :loading="isLoading" @click="createUser" type="primary" size="large"
				>{{btn}}</el-button
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
