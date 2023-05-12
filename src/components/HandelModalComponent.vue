<script setup>
import { useInvoiceStore } from '../stores/invoices';

const invoiceStore = useInvoiceStore()

const closeModal = ()=>{
    invoiceStore.toggleModal()
}

const closeInvoice = ()=>{
    invoiceStore.toggleInvoice()
    invoiceStore.toggleModal()
    if (invoiceStore.editInvoice) {
        invoiceStore.toggleEditInvoice()
    }
    if (invoiceStore.infoShow) {
        invoiceStore.toggleInvoiceInfo()
    }
}

</script>

<template>
    <div class="modal flex">
        <div class="modal-content">
            <p>Are you sure you want to exit? Your changes will not be saved?</p>
            <div class="actions flex">
                <button @click="closeModal" class="purple">Return</button>
                <button @click="closeInvoice" class="red">Close</button>
            </div>
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