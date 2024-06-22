<script >
import { Plus, Search } from '@element-plus/icons-vue'
import ActionsMenu from '@/components/reusables/ActionsMenu.vue'
export default {
	components:{
		ActionsMenu,
	},
	data(){
		return {
			users:this.$store.state.users,
			isLoading:false,keyword:""
		}
	},
	watch: {
	 "$store.state.users"(new_val){
	 	this.users=new_val
	 },
	 "keyword"(new_val){
	 	this.users = this.$store.state.users.filter(x =>{
        return JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
      })
	 }
	},
	mounted(){
		this.fetchUsers()
	},
	methods:{
		fetchUsers(){
			this.isLoading=true
			axios.get('users/')
			.then((res)=>{
				this.isLoading=false
				this.$store.state.users=res.data.results
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
			<v-col>
				<h4 class="font-weight-medium">Utilisateurs</h4>
			</v-col>
			<v-col cols="auto">
				<el-button v-if="active_user.is_superuser" type="primary" :icon="Plus" @click="$router.push({ name: 'createUser' })"
					>Ajouter</el-button
				>
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
			<el-table v-loading="isLoading" :data="users" style="width: 100%">
				<el-table-column label="Nom d'utilisateur" width="auto">
					<template #default="scope">
						<span class="text-truncate">{{ scope.row.username }}</span>
					</template>
				</el-table-column>
				<el-table-column label="Nom" width="auto">
					<template #default="scope">
						<span class="text-truncate">{{ scope.row.first_name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="Prénom">
					<template #default="scope">
						<div>
							<span>{{ scope.row.last_name }}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Rôle">
					<template #default="scope">
						<div>
							<span>{{ getGroupsName(scope.row.groups) }}</span>
						</div>
					</template>
				</el-table-column>	
				<el-table-column label="Operations">
			      <template #default="scope">
			        <el-button size="small" type="primary" @click="$router.push({
										name: 'updateUser',
										params: {
											id: scope.row.id,
										}
									})"
			          >Voir / Modifier</el-button
			        >
			      </template>
			    </el-table-column>			
			</el-table>
		</el-card>
	</div>
</template>

<style lang="scss" scoped></style>
