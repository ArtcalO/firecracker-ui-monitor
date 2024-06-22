<script setup>
import { CirclePlus, Delete, Edit, More } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const props = defineProps({
	item: {
		type: Object,
		required: true
	},
	editable: {
		type: Boolean,
		default: true
	},
	deletable: {
		type: Boolean,
		default: true
	}
})
const emit = defineEmits(['viewMore', 'update', 'delete', 'cancelled'])

function handleDelete() {
	ElMessageBox.confirm('Voulez-vous vraiment supprimer?', {
		confirmButtonText: 'Confirmer',
		cancelButtonText: 'Annuler',
		type: 'warning'
	})
		.then(() => {
			emit('delete', props.item)
		})
		.catch(() => emit('cancelled'))
}
</script>

<template>
	<el-dropdown placement="bottom-end">
		<span class="el-dropdown-link border rounded-1 pa-2 d-flex align-center">
			<el-icon rotate><More /></el-icon>
		</span>
		<template #dropdown>
			<el-dropdown-menu type="primary">
				<el-dropdown-item :icon="CirclePlus" @click="emit('viewMore', item)">
					Détails
				</el-dropdown-item>
				<el-dropdown-item v-if="editable" :icon="Edit" @click="emit('update', item)">
					Modifier
				</el-dropdown-item>
				<el-dropdown-item v-if="deletable" :icon="Delete" @click="handleDelete">
					Supprimer
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<style scoped>
[rotate] {
	rotate: 90deg;
}
</style>
