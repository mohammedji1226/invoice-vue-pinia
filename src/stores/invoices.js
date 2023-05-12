import { defineStore } from "pinia";
import { uid } from "uid";

import { db } from "../firebase/initfirebase";
import {
  doc,
  collection,
  deleteDoc,
  onSnapshot,
  addDoc,
  updateDoc 
} from "firebase/firestore";

const invoicesCollection = collection(db, "invoices");

export const useInvoiceStore = defineStore("invoices", {
  state: () => ({
    invoiceModal: false,
    infoShow: false,
    modalActive: false,
    editInvoice: false,
    deleteInvoiceItem:false,
    deleteInvoiceModal:false,    
    invoicesData: [],
    currentInvoiceArray: [],
  }),
  getters: {},
  actions: {
    toggleInvoice() {
      return (this.invoiceModal = !this.invoiceModal);
    },

    toggleInvoiceInfo() {
      return (this.infoShow = !this.infoShow);
    },

    toggleModal() {
      return (this.modalActive = !this.modalActive);
    },

    toggleEditInvoice(){
      this.editInvoice = !this.editInvoice
    },

    toggleDeleteInvoice(){
      this.deleteInvoiceModal = !this.deleteInvoiceModal
    },

    async getInvoices() {
       onSnapshot(invoicesCollection, (allInvoices) => {
        const fbInvoices = [];
        allInvoices.forEach((invoice) => {
          fbInvoices.push({
            docId: invoice.id,
            ...invoice.data()
          });
          this.invoicesData = fbInvoices;
        });
      });
    },

    async addInvoice(form) {
      const docRef = await addDoc(collection(db, "invoices"), form);
    },

    getOneInvoice(id) {      
        this.currentInvoiceArray = this.invoicesData.filter((invoice) => {
          return invoice.invoiceId === id;
        });      
    },

    async deleteInvoice(id){
      this.invoicesData = this.invoicesData.filter((invoice) => {
        return invoice.docId !== id;
      }) 
      await deleteDoc(doc(db, "invoices", id))   
    },

    async updateInvoice(id,form){
      const invoice = doc(db, "invoices", id)
      await updateDoc(invoice,form)
      this.editInvoice = false
      this.infoShow = false
    },

    async updateStatusPaid(id){
      const invoice = doc(db, "invoices", id)
      await updateDoc(invoice,{
          invoicePaid : true,
          invoicePending: false
      })
    },

    async updateStatusPending(id){
      const invoice = doc(db, "invoices", id)
      await updateDoc(invoice,{
          invoicePaid : false,
          invoicePending: true,
          invoiceDraft:false
      })
    },
  },
});
