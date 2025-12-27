import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.cloudinary_cloud_name , 
        api_key: process.env.cloudinary_api_key , 
        api_secret: process.env.cloudinary_api_secret, 
    });
    const uploadOnCloudinary = async (localfilePath) => {
        try {
            if(!localfilePath)return null;
          const response=await  cloudinary.uploader.upload(localfilePath, 
                {resource_type: 'auto'})
                console.log("file uploaded to cloudinary successfully",response.url);
                return response;
        }catch(error){
            fs.unlinkSync(localfilePath);//remove file from local server
            return null;
        }
    };
});
export { uploadOnCloudinary};















    