import { initializeApp } from "firebase/app";
const firebaseConfig2 = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig2, 'secondary');

export default app;