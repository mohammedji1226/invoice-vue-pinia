<script setup>

import {ref} from 'vue'
import { useInvoiceStore} from '../stores/invoices'
import Invoice from '../components/InvoiceComponent.vue'

const invoiceStore = useInvoiceStore()
const filterMenu = ref(false)
const filteredInvoice = ref(null)
const dataToFilter = ref([])
const toggleFilterMenu = () =>{
  filterMenu.value =! filterMenu.value
}
const newInvoice = () =>{
  invoiceStore.toggleInvoice()
}

const filteredInvoices = (e)=>{
    if (e.target.innerText === 'Clear Filter') {
      filteredInvoice.value = null
      return
    }
    filteredInvoice.value = e.target.innerText

    if (filteredInvoice.value === 'Draft') {
      dataToFilter.value = invoiceStore.invoicesData.filter(invoice=>{
         return invoice.invoiceDraft === true
      })
    }
    if (filteredInvoice.value === 'Pending') {
       dataToFilter.value = invoiceStore.invoicesData.filter(invoice=>{
         return invoice.invoicePending === true
      })
    }
    if (filteredInvoice.value === 'Paid') {
      dataToFilter.value = invoiceStore.invoicesData.filter(invoice=>{
         return invoice.invoicePaid === true
      })
    }
    
}
</script>

<template>
  <div class="home container">
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Invoices</h1>
        <span>There are 4 total invoices</span>
      </div>
      <div class="right flex">
        <div @click="toggleFilterMenu" class="filter flex">
          <span
            >Filter by status <span v-if="filteredInvoice">: {{ filteredInvoice }}</span></span
          >
          <img src="@/assets/icon-arrow-down.svg" alt="" />
          <ul v-show="filterMenu" class="filter-menu">
            <li @click="filteredInvoices">Draft</li>
            <li @click="filteredInvoices">Pending</li>
            <li @click="filteredInvoices">Paid</li>
            <li @click="filteredInvoices">Clear Filter</li>
          </ul>
        </div>
        <div @click="newInvoice()" class="button flex">
          <div class="inner-button flex">
            <img src="@/assets/icon-plus.svg" alt="" />
          </div>
          <span>New Invoice</span>
        </div>
      </div>
    </div>
    <!-- Invoices -->
    <div v-if="invoiceStore.invoicesData.length > 0">
      <div v-if="!filteredInvoice" >
        <Invoice v-for="(invoice, invoiceId) in invoiceStore.invoicesData" :invoice="invoice" :key="invoiceId" />
      </div>
      <div v-else >
        <Invoice v-for="(invoice, invoiceId) in dataToFilter" :invoice="invoice" :key="invoiceId" />
      </div>
    </div>
    <div v-else class="empty flex flex-column">
      <img src="@/assets/illustration-empty.svg" alt="" />
      <h3>There is nothing here</h3>
      <p>Create a new invoice by clicking the New Invoice button and get started</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  color: #fff;
  .header {
    margin-bottom: 65px;
    .left,
    .right {
      flex: 1;
    }
    .right {
      justify-content: flex-end;
      align-items: center;
      .button,
      .filter {
        align-items: center;
        span {
          font-size: 12px;
          background-color: transparent;
        }
      }
      .filter {
        position: relative;
        margin-right: 40px;
        cursor: pointer;
        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }
        .filter-menu {
          width: 120px;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;
            &:hover {
              color: #1e2139;
              background-color: #fff;
            }
          }
        }
      }
      .button {
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;
        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          img {
            width: 10px;
            height: 10px;
            background-color: #fff;
          }
        }
      }
    }
  }
  .empty {
    margin-top: 160px;
    align-items: center;
    img {
      width: 214px;
      height: 200px;
    }
    h3 {
      font-size: 20px;
      margin-top: 40px;
    }
    p {
      text-align: center;
      max-width: 224px;
      font-size: 12px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
}
</style>
