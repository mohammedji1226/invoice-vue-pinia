<script setup>
import { ref, onMounted, watch } from 'vue'
import { uid } from 'uid'
import Loading from '../components/LoadingComponent.vue'
import { useInvoiceStore } from '../stores/invoices'

const invoiceStore = useInvoiceStore()
const dateOption = ref({ year: "numeric", month: "short", day: "numeric" })
const form = ref({
    invoiceId: uid(6),
    msStore: 'MS STORE',
    billerCity: 'Chéria',
    billerCountry: 'Algéria',
    clientName: 'Customer',
    clientEmail: 'customer@email.com',
    clientStreetAddress: 'Chéria',
    clientCity: 'Chéria',
    clientCountry: 'Algéria',
    invoiceDate: '',
    invoiceDateUnix: '',
    paymentDueDate: '',
    paymentDueDateUnix: '',
    paymentTerms: '',
    invoiceDraft: false,
    invoicePending: false,
    invoiceItemList: [],
    invoiceTotal: 0,
    invoicePaid: false,
})
const loading = ref(false)
const invoiceWrap = ref('')

onMounted(() => {
    if (!invoiceStore.editInvoice) {
        form.value.invoiceDateUnix = Date.now()
        form.value.invoiceDate = new Date(form.value.invoiceDateUnix).toLocaleDateString('fr', dateOption.value)
    }
    if (invoiceStore.editInvoice) {
        const currentInvoice = invoiceStore.currentInvoiceArray[0]       
        form.value.invoiceId = currentInvoice.invoiceId
        form.value.msStore  = currentInvoice.msStore
        form.value.billerCity = currentInvoice.billerCity
        form.value.billerCountry = currentInvoice.billerCountry
        form.value.clientName = currentInvoice.clientName
        form.value.clientEmail = currentInvoice.clientEmail
        form.value.clientStreetAddress = currentInvoice.clientStreetAddress
        form.value.clientCity = currentInvoice.clientCity
        form.value.clientCountry = currentInvoice.clientCountry
        form.value.invoiceDate = currentInvoice.invoiceDate
        form.value.invoiceDateUnix = currentInvoice.invoiceDateUnix
        form.value.paymentDueDate = currentInvoice.paymentDueDate
        form.value.paymentDueDateUnix = currentInvoice.paymentDueDateUnix
        form.value.paymentTerms = currentInvoice.paymentTerms
        form.value.invoiceDraft = currentInvoice.invoiceDraft
        form.value.invoicePending = currentInvoice.invoicePending
        form.value.invoiceItemList = currentInvoice.invoiceItemList
        form.value.invoiceTotal = currentInvoice.invoiceTotal
        form.value.invoicePaid = currentInvoice.invoicePaid 
    }
})
watch(form.value, () => {
    if (form.value.paymentTerms) {
        const futrureDate = new Date()
        form.value.paymentDueDateUnix = futrureDate.setDate(futrureDate.getDate() + parseInt(form.value.paymentTerms))
        form.value.paymentDueDate = new Date(form.value.paymentDueDateUnix).toLocaleDateString("fr", dateOption.value)
    }

})


const showInfo = () => {
    invoiceStore.toggleInvoiceInfo()
}

const closeInvoice = () => {
    invoiceStore.toggleInvoice()
    if (invoiceStore.editInvoice) {
       invoiceStore.toggleEditInvoice() 
    }
    if (invoiceStore.infoShow) {
        invoiceStore.toggleInvoiceInfo()
    }
}

const checkClick = (e)=>{
    if (e.target === invoiceWrap.value) {
        invoiceStore.toggleModal()
    }
}

const addNewInvoiceItem = () => {
    form.value.invoiceItemList.push({
        id: uid(4),
        itemName: '',
        qty: '',
        price: 0,
        total: 0
    })
}

const deleteInvoiceItem = (id) => {
    form.value.invoiceItemList = form.value.invoiceItemList.filter(item => {
        return item.id !== id
    })
}

const publishInvoice = () =>{
    form.value.invoicePending = true
}

const calcInvoiceTotal = ()=>{
    form.value.invoiceTotal = 0
    form.value.invoiceItemList.forEach(item =>{
        form.value.invoiceTotal += item.total
    })
}

const saveDraft = () =>{
    form.value.invoiceDraft = true
}

const uploadInvoice = async()=>{
    if (form.value.invoiceItemList.length <=0) {
        alert('Please ensure you filled out work items!')
        return
    }
    loading.value = true
    calcInvoiceTotal()
    setTimeout(()=>{
        invoiceStore.toggleInvoice()
        loading.value = true
    },1500)
}

const submitForm = (form)=>{
    if (!invoiceStore.editInvoice) {
        uploadInvoice()
        invoiceStore.addInvoice(form)
    }
    if (invoiceStore.editInvoice){
        const currentInvoice = invoiceStore.currentInvoiceArray[0]  
        uploadInvoice()  
        invoiceStore.updateInvoice(currentInvoice.docId, form) 
        
    }
}
</script>

<template>
    <div @click="checkClick" ref="invoiceWrap" class="invoice-wrap flex flex-column">
        <form @submit.prevent="submitForm(form)" class="invoice-content">
            <Loading v-show="loading" />
            <h1 v-if="!invoiceStore.editInvoice">New Invoice</h1>
            <h1 v-else>Edit Invoice</h1>
            <div @click="showInfo" class="info-button flex">
                <div class="inner-button flex">
                    <img src="@/assets/icon-plus.svg" alt="" />
                </div>
                <span>info</span>
            </div>
            <Transition name="info">            
                <div v-if="invoiceStore.infoShow">
                    <!-- Bill From -->
                    <div class="bill-from flex flex-column">
                        <h4>Bill From</h4>
                        <div class="input flex flex-column">
                            <label for="ms-store">MS STORE</label>
                            <input required type="text" id="ms-store" v-model="form.msStore" readonly />
                        </div>
                        <div class="location-details flex">
                            <div class="input flex flex-column">
                                <label for="billerCity">City</label>
                                <input required type="text" id="billerCity" v-model="form.billerCity" readonly />
                            </div>
                            <div class="input flex flex-column">
                                <label for="billerCountry">Country</label>
                                <input required type="text" id="billerCountry" v-model="form.billerCountry" readonly />
                            </div>
                        </div>
                    </div>

                    <!-- Bill To -->
                    <div class="bill-to flex flex-column">
                        <h4>Bill To</h4>
                        <div class="input flex flex-column">
                            <label for="clientName">Client's Name</label>
                            <input required type="text" id="clientName" v-model="form.clientName" />
                        </div>
                        <div class="input flex flex-column">
                            <label for="clientEmail">Client's Email</label>
                            <input required type="text" id="clientEmail" v-model="form.clientEmail" />
                        </div>
                        <div class="input flex flex-column">
                            <label for="clientStreetAddress">Street Address</label>
                            <input required type="text" id="clientStreetAddress" v-model="form.clientStreetAddress" />
                        </div>
                        <div class="location-details flex">
                            <div class="input flex flex-column">
                                <label for="clientCity">City</label>
                                <input required type="text" id="clientCity" v-model="form.clientCity" />
                            </div>

                            <div class="input flex flex-column">
                                <label for="clientCountry">Country</label>
                                <input required type="text" id="clientCountry" v-model="form.clientCountry" />
                            </div>
                        </div>
                    </div>

                </div>
            </Transition>
           
            <!-- Invoice Work Details -->
                <div class="invoice-work flex flex-column">
                    <div class="payment flex">
                        <div class="input flex flex-column">
                            <label for="invoiceDate">Invoice Date</label>
                            <input disabled type="text" id="invoiceDate" v-model="form.invoiceDate" />
                        </div>
                        <div class="input flex flex-column">
                            <label for="paymentDueDate">Payment Due</label>
                            <input disabled type="text" id="paymentDueDate" v-model="form.paymentDueDate" />
                        </div>
                    </div>
                    <div class="input flex flex-column">
                        <label for="paymentTerms">Payment Terms</label>
                        <select required type="text" id="paymentTerms" v-model="form.paymentTerms">
                            <option value="30">Net 30 Days</option>
                            <option value="60">Net 60 Days</option>
                        </select>
                    </div>
                    <div class="work-items">
                        <h3>Item List</h3>
                        <table class="item-list">
                            <tr class="table-heading flex">
                                <th class="item-name">Item Name</th>
                                <th class="qty">Qty</th>
                                <th class="price">Price</th>
                                <th class="total">Toal</th>
                            </tr>
                            <tr class="table-items flex" v-for="(item, index) in form.invoiceItemList" :key="index">
                                <td class="item-name"><input type="text" v-model="item.itemName" autofocus /></td>
                                <td class="qty"><input type="text" v-model="item.qty" /></td>
                                <td class="price"><input type="text" v-model="item.price" /></td>
                                <td class="total flex">${{ (item.total = item.qty * item.price) }}</td>
                                <img @click="deleteInvoiceItem(item.id)" src="@/assets/icon-delete.svg" alt="" />
                            </tr>
                        </table>

                        <div @click="addNewInvoiceItem()" class="flex button">
                            <img src="@/assets/icon-plus.svg" alt="" />
                            Add New Item
                        </div>
                    </div>
                </div>
           
            <!-- Save/Exit -->
                <div class="save flex">
                    <div class="left">
                        <button type="button" @click="closeInvoice" class="red">Cancel</button>
                    </div>
                    <div class="right flex">
                        <button v-if="!invoiceStore.editInvoice" type="submit" @click="saveDraft" class="dark-purple">Save Draft</button>
                        <button v-if="!invoiceStore.editInvoice" type="submit" @click="publishInvoice" class="purple">Create Invoice</button>
                        <button v-if="invoiceStore.editInvoice"  class="purple">Update Invoice</button>
                    </div>
                </div>
            
        </form>
    </div>
</template>
  
<style lang="scss" scoped>

// animated Information

.info-enter-active,
.info-leave-active {
    transition: transform 1.5s ease-in-out;
}

.info-enter-from,
.info-leave-to {
    transform: translateY(-684px);    
}

.invoice-wrap {
    z-index: 98;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: scroll;

    &::-webkit-scrollbar {
        display: none;
    }

    @media (min-width: 900px) {
        left: 90px;
    }

    .invoice-content {
        top: 56px;
        position: relative;
        padding: 56px;
        max-width: 700px;
        width: 100%;
        background-color: #141625;
        color: #fff;
        box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

        @media(min-width: 900px) {
            top: 0;
        }

        h1 {
            margin-bottom: 48px;
            color: #fff;
        }

        h3 {
            margin-bottom: 16px;
            font-size: 18px;
            color: #777f98;
        }

        h4 {
            color: #7c5dfa;
            font-size: 12px;
            margin-bottom: 24px;
        }

        // Bill To / Bill From
        .bill-to,
        .bill-from {
            margin-bottom: 48px;

            .location-details {
                gap: 16px;

                div {
                    flex: 1;
                }
            }
        }

        // Invoice Work
        .invoice-work {
            .payment {
                gap: 24px;

                div {
                    flex: 1;
                }
            }

            .work-items {
                .item-list {
                    width: 100%;

                    // Item Table Styling
                    .table-heading,
                    .table-items {
                        gap: 16px;
                        font-size: 12px;

                        .item-name {
                            flex-basis: 50%;
                        }

                        .qty {
                            flex-basis: 10%;
                        }

                        .price {
                            flex-basis: 20%;
                        }

                        .total {
                            flex-basis: 20%;
                            align-self: center;
                        }
                    }

                    .table-heading {
                        margin-bottom: 16px;

                        th {
                            text-align: left;
                        }
                    }

                    .table-items {
                        position: relative;
                        margin-bottom: 24px;

                        img {
                            cursor: pointer;
                            position: absolute;
                            top: 15px;
                            right: 0;
                            width: 12px;
                            height: 16px;
                        }
                    }
                }

                .button {
                    color: #fff;
                    background-color: #252945;
                    align-items: center;
                    justify-content: center;
                    width: 100%;

                    img {
                        margin-right: 4px;
                    }
                }
            }
        }

        .save {
            margin-top: 60px;

            div {
                flex: 1;
            }

            .right {
                justify-content: flex-end;
            }
        }
    }
    .info-button{
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;
        max-width: 88px;
        position: absolute;
        top: 64px;
        right: 32px;
        cursor: pointer;
        align-items: center;
        .inner-button{
            margin-right: 8px;
            border-radius: 50%;
            padding: 8px;
            align-items: center;
            justify-content: center;
            background-color: #fff;
        }
    }

    .input {
        margin-bottom: 24px;
    }

    label {
        font-size: 12px;
        margin-bottom: 6px;
    }

    input,
    select {
        width: 100%;
        background-color: #1e2139;
        color: #fff;
        border-radius: 4px;
        padding: 12px 4px;
        border: none;

        &:focus {
            outline: none;
        }
    }
}
</style>