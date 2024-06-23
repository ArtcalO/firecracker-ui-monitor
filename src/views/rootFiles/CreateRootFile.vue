<script >
import { UploadFilled } from '@element-plus/icons-vue'
import { useDateFormat } from '@vueuse/core'

export default{
	data(){
		return {
			isLoading:false,
			root_file:{
                os_id:null,
				file:null,
                
			},
		}
	},
    mounted(){
        this.fetchOSes()
    },
	components:{UploadFilled},
	methods:{
		dragOver1(event){
			event.preventDefault()
		},
		drop1(event){
			event.preventDefault()
			this.handleFiles1(event.dataTransfer.files)
		},
		handleFileInput1(event){
			this.handleFiles1(event.target.files)
		},
		handleFiles1(files){
			if (files.length > 0) {
				const file = files[0]
				console.log(file)
				this.root_file.file = file
				const reader = new FileReader()

				reader.readAsDataURL(file)
			}
		},
		createRootFile(){
			if(this.root_file.os_id==null){
				this.useNotifyError("Veuillez selectionner OS ")
				return
			}
			if(this.root_file.file==null){
				this.useNotifyError("Veuillez selectionner le fichier root ")
				return
			}
			let data = new FormData()
			data.append("os_id",this.root_file.os_id)
			data.append("file",this.root_file.file)
			axios.post("root_files/", data)
			.then((res)=>{
				this.useNotifySuccess("root_file Crée avec success !")
				this.$store.state.root_files.push(res.data)
				this.$router.go(-1)
			})
			.catch((err)=>{
				this.isLoading=false
				console.log(err)
				this.errorOrRefresh(err, this.createRootFile)
			}).finally(()=>this.isLoading=false)
		},
        fetchOSes(){
            axios.get(`oses/`)
            .then((res)=>{
                this.isLoading=false
                this.$store.state.OSes=res.data
            })
            .catch((err)=>{
                this.isLoading=false
                console.log(err)
                this.errorOrRefresh(err, this.fetchOSes)
            })
            },
	}
}

</script>

<template>
	<el-card>
		<el-form label-position="top" label-width="100px" :model="root_file">
			<h5 class="border-b pb-3 mb-3">Création d'un root file</h5>
			<el-row :gutter="20">
				<el-col :span="24" :sm="12">
                    <el-form-item label="Type d' OS">
						<el-select filterable v-model="root_file.os_id" placeholder="Select OS" class="w-100">
							<el-option
								v-for="item in $store.state.OSes"
								:key="item?.id"
								:label="item?.name"
								:value="item?.id"
							/>
						</el-select>
					</el-form-item>
					<el-form-item label="FIchier rootfile">
						<label for="file1" class="w-100">
							<div
								class="el-upload el-upload--text is-drag"
								tabindex="0"
								@dragenter="dragEnter1"
								@dragover="dragOver1"
								@drop="drop1"
							>
								<div class="el-upload-dragger p-2">
									<div v-if="root_file.file==null">
										<el-icon class="el-icon--upload"><upload-filled /></el-icon>
										<div class="el-upload__text">
											Déposez le fichier ici ou <em>cliquez pour selectionner</em>
										</div>
									</div>
									<div v-else class="el-upload__text">
											<em>{{ root_file.file.name }}</em>
									</div>
									<input
										class="el-upload__input"
										@change="handleFileInput1"
										name="file1"
										id="file1"
										accept=""
										type="file"
									/>
								</div>
							</div>
						</label>
					</el-form-item>
				</el-col>
               	
			</el-row>
			<el-button :loading="isLoading" @click="createRootFile" type="primary" size="large"
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
