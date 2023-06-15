import {storage, ID} from "@/appWrite"
const uploadImage = async (file: File) => {
    if(!file) return;
    const fileUpload = await storage.createFile("648aac0f9a3d5bf9d28a", ID.unique(), file);
    return fileUpload;


}


export default uploadImage;

// 647b22658e3659b24cb6