import { storage } from "@/appWrite";

export const getUrl = async (image: Image) => {
    const url =  storage.getFilePreview(image.bucketId, image.fileId)
  return url;

}

export default getUrl;