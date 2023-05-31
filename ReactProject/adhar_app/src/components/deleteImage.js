import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
    deleteObject
  } from "firebase/storage";
 
import  app  from "./firebase";

const storage = getStorage(app);

const DeleteImage=async(imgurl)=>{
    const desertRef = ref(storage, imgurl);
    let result = await deleteObject(desertRef);
    // console.log(result);
    // return ("X");
}

export default DeleteImage;