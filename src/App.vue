<script >
	export default {
		data(){
			return{
				interval:null,
				last_id:null
			}
		},
		watch: {
			"last_id":{
				deep:true,
			      handler(new_val){
			        if(!!new_val){
			          localStorage.setItem('last_id', JSON.stringify(new_val));
			        } else {
			          localStorage.removeItem('last_id')
			        }
			      }
			},
			"$store.state.user":{
		      deep:true,
		      handler(new_val){
		        if(!!new_val){
		          localStorage.setItem('user', JSON.stringify(new_val));
		        } else {
		          localStorage.removeItem('user')
		        }
		      }
			},
		},
		mounted(){
			this.last_id = JSON.parse(localStorage.getItem('last_id'));
			var user = JSON.parse(localStorage.getItem('user'));
		    if(user) {
		      this.$store.state.user = user;
		      this.fetchNotification()
		    }

		},
		methods: {
		  fetchNotification(){
		      let vue = this
		      this.interval = setInterval(() => {
		          axios.get("notifications/")
		          .then((response) => {
		          	if(response.data.count>0)
		          		if(this.last_id!=response.data.results[0].id){
		          			this.last_id=response.data.results[0].id
		             		vue.useNotifySuccess(response.data.results[0].details)
		             	}
		          }).catch((error) => {
		            console.log(error)
		          })
		      }, 5000)
		    },
		},
	}	
</script>

<template>
	<div class="app">
		<router-view :key="$route.fullPath" />
	</div>
</template>

<style scoped></style>
