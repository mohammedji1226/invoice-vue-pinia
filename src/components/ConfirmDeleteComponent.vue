<script setup>
import { ref } from 'vue';
import { useRoute , useRouter } from 'vue-router'
import { useInvoiceStore } from '../stores/invoices';

const route = useRoute()
const router = useRouter()
const invoiceStore = useInvoiceStore()

const confirmDelete = ref(false)

const getCurrentInvoice =()=>{     
    invoiceStore.getOneInvoice(route.params.invoiceId)
   
}


const submitDelete = () => {  
   invoiceStore.toggleDeleteInvoice()
   if (confirmDelete.value){
    getCurrentInvoice()     
    invoiceStore.deleteInvoice(invoiceStore.currentInvoiceArray[0].docId)
    router.push('/')
   }
}
</script>

<template>
    <div class="modal flex">
        <div class="modal-content">
            <p>Are you sure you want to delete Inovice?</p>
            <form @submit.prevent="submitDelete(id)" class="actions flex">
                <button type="submit" @click="confirmDelete =! confirmDelete" class="purple">YES</button>
                <button type="submit"  class="red">NO</button>
            </form>
        </div>
    </div>
</template>
  
<style lang="scss" scoped>
.modal {
    z-index: 100;
    position: fixed;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;

    .modal-content {
        border-radius: 20px;
        padding: 48px 32px;
        max-width: 450px;
        background-color: #252945;
        color: #fff;

        p {
            text-align: center;
            background-color: transparent;
        }

        .actions {
            margin-top: 24px;
            background-color: transparent;

            button {
                flex: 1;
            }
        }
    }
}</style>