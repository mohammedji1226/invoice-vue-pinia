import { initializeApp } from "firebase/app"
import { getFirestore} from "firebase/firestore"


const firebaseConfig = {
  apiKey: 'AIzaSyDEn1_VR4ypP5rz2t7HlfTKMLthgusL0go',
  authDomain: 'ms-tech-stor.firebaseapp.com',
  projectId: 'ms-tech-stor',
  storageBucket: 'ms-tech-stor.appspot.com',
  messagingSenderId: '621431156644',
  appId: '1:621431156644:web:01f0c3fc16881073da9b31'
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export{
    db
}