<template>
  <el-dialog
    v-model="dialogVisible"
    :title="'Details Transfert N ° '+transfertDetailsProps.id"
    top="2vh"
    width="21cm"
    heigth="1000"
  >

  <el-row :gutter="20">
    <el-col :span="8">
      <div class="make-flex">
         <el-image style="width: 50px; height: 50px" src="/logo.png"  />
         <div>
           <p>K-SHOP</p>
           <p class="make-small">NIF : 4002269597 | R.C : 0045325/23</p>
         </div>
        </div>
    </el-col>
    <el-col :span="10"  :offset="6">
      <p m="t-0 b-2" ><u>Transferé par</u></p>
      <p m="t-0 b-2" >Nom & Prénom : {{transfertDetailsProps.transfered_by.fullname}}</p>
    </el-col>
  </el-row>
  <br>
  <el-descriptions
    direction="vertical"
    :column="3"
    size="small"
    border
  >
    <el-descriptions-item label="Numéro facture">{{transfertDetailsProps.id}}</el-descriptions-item>
    <el-descriptions-item label="Date facture">{{datetime(transfertDetailsProps.created_at)}}</el-descriptions-item>
   <!--  <el-descriptions-item label="Total en BIF"><strong>{{money(transfertDetailsProps.amount)}} BIF</strong></el-descriptions-item> -->
    <el-descriptions-item label="Statut">{{transfertDetailsProps.received_by?'Déjà reçu':'Pas encore reçu'}}</el-descriptions-item>
  </el-descriptions>

  <el-table
    :data="transfertDetailsProps.items"
    table-layout="auto"
    :header-row-class-name="headerStyle"
  >
    <el-table-column label="Id">
      <template #default="scope">
        <div>
          <span>{{ scope.row.id }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Produit">
      <template #default="scope">
        <div>
          <span>{{ scope.row.product.name }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Quantité">
      <template #default="scope">
        <div>
          <span>{{ scope.row.quantity }} {{scope.row.product.out_unity}}</span>
        </div>
      </template>
    </el-table-column>
   <!--  <el-table-column label="P.U">
      <template #default="scope">
        <div>
          <span>{{ money(scope.row.sale_price) }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="PT/HTVA">
      <template #default="scope">
        <div>
          <span>{{ money(scope.row.quantity*scope.row.sale_price) }}</span>
        </div>
      </template>
    </el-table-column> -->
  </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$emit('close')">Cancel</el-button>
        <el-button type="primary" @click="imprimer">
          Imprimer
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script >
export default{
  props:["transfertDetailsProps"],
  data(){
    return {
      dialogVisible:true,
    }
  },
  computed:{
    headerStyle(){
      return "warning-row"
    }
  },
  methods: {
    imprimer() {
      print()
    },
  },
}

</script>
<style scoped>
p{
  margin-bottom:0px;
}
.el-table thead {
  background-color:red;
  color:blue;
}

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.make-flex{
  display:flex;
  flex-direction:row;
  align-items:center
}

.make-small{
  font-size:12px;
  color:gray;
}

</style>
