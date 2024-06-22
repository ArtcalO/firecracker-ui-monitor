<script >
import { UploadFilled } from '@element-plus/icons-vue'
import { useDateFormat } from '@vueuse/core'

export default{
	data(){
		return {
			confirm:"",
			isLoading:false,
			getRapportLabel:"",
			rapport_shown:false,
			product:{
				name:"",
				in_unity:"piece",
				rapport:1,
                image:null,
            },
            imageData1:null,
            logs:""
		}
	},
	components:{
		UploadFilled,
	},
	watch: {
		"product.in_unity":{
	      deep:true,
	      handler(new_val){
	        if(new_val=="carton"){
	        	this.rapport_shown=true
	        	this.getRapportLabel="1 carton vaut combien de piece ? ex 1 carton = 12 piece"
	        }else{
	        	this.rapport_shown=false
	        }
	      }
		},
	},
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
				this.product.image = file
				const reader = new FileReader()

				reader.onload = () => {
					this.imageData1 = reader.result
				}

				reader.readAsDataURL(file)
			}
		},
        ajouterproduct(){
	        if(!this.product.name){
	            this.useNotifyError("pas de nom product")
	            return;
	        }
	        if(!this.product.image){
	            this.useNotifyError("pas d'image")

	            return;
	        }
	        
	        this.isLoading=true
	        let data = new FormData()
	        data.append("name",this.product.name)
			data.append("image",this.product.image)
			data.append("in_unity",this.product.in_unity)
			data.append("rapport",this.product.rapport)
	        axios.post(`products/`, data)
	        .then((response) => {
	        	this.isLoading=false
	            this.product = {}
	            this.$store.state.products.push(response.data);
	            this.$router.go(-1)
	            this.useNotifySuccess("product ajouté avec succes !")
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
		<el-form label-position="top" label-width="100px" :model="product">
			<h5 class="border-b pb-3 mb-3">Informations sur le produit ou l'article</h5>
			<el-row :gutter="20">
				<el-col :span="24" :sm="12">
					<el-form-item label="Nom">
						<el-input v-model="product.name" name="name" />
					</el-form-item>
					<el-form-item label="Unité">
						<el-select filterable v-model="product.in_unity" placeholder="Select" class="w-100">
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
						<el-input :placeholder="getRapportLabel" type="number" v-model="product.rapport" name="rapport" />
					</el-form-item>
				</el-col>
				<el-col :span="24" :sm="12">
					<el-form-item label="Image 1 ">
						<label for="file1" class="w-100">
							<div
								class="el-upload el-upload--text is-drag"
								tabindex="0"
								@dragenter="dragEnter1"
								@dragover="dragOver1"
								@drop="drop1"
							>
								<div class="el-upload-dragger p-2">
									<div v-if="!imageData1">
										<el-icon class="el-icon--upload"><upload-filled /></el-icon>
										<div class="el-upload__text">
											Déposez le fichier ici ou <em>cliquez pour selectionner</em>
										</div>
									</div>
									<img v-else :src="imageData1" alt="Uploaded Image" />
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

			<el-button :loading="isLoading" @click="ajouterproduct" type="primary" size="large"
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
</style>
