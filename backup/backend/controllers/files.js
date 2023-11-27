import Files from "../models/files.js";
import Joi from 'joi';
import fs from 'fs';
import cloudinary from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


const addFileSchema = Joi.object({
    name: Joi.string().min(1).max(30).required(),
    folder_id:Joi.allow(),
    
});

const updateFileSchema = Joi.object({
    _id: Joi.allow(),
    name: Joi.string().min(1).max(30).required(),
    folder_id:Joi.allow(),
});

export const createFile= async (req, res)=>{   
    const {name}=req.body;
    const files=req.body;
    
    try{
        const { error, value } = addFileSchema.validate(req.body);

        if (error) {
            // Return a 400 Bad Request response if validation fails
            return res.status(400).json({ message: error.details[0].message });
        }
       
        const existingFile = await Files.findOne({
            name,
            $and: [
              { folder_id: { $ne: files.folder_id } },
              { folder_id: { $ne: null } },
            ],
          });
          
          if (existingFile) {
            return res.status(400).json({ message: 'File already exists.' });
          }


        if(req.file){
            if (req.file || Object.keys(req.file).length !== 0){
                const file = req.file;    
                // uploading image to cloudnary
                try{

                    await cloudinary.v2.uploader.upload(file.path, { folder: "Directory_APP", resource_type: 'raw' }, async (err, result) => {
                        if(err) throw err;
                        removeTmp(file.path)
                        files.path= { public_id: result.public_id, url: result.secure_url }
                    })
                }catch(error){
                    console.log(error)
                }
            }
        }

        const NewFile= new Files({...files});
        const savedFile = await NewFile.save();

        // Check if the file was successfully added
        if (savedFile) {
          // Return a 200 status with a success message
          return res.status(200).json({ message: 'File successfully added.' });
        } else {
          // If for some reason the file was not saved, return a 500 status
          return res.status(500).json({ message: 'Failed to add file.' });
        }

    }catch(error){
        // If an error occurs during the process, return a 500 status with the error message
        console.error('Error creating file:', error);
        return res.status(500).json({ message: error });
    }
}

export const GetFiles=async(req, res)=>{  
    try{
        const files= await Files.find({folder_id:null});
        return res.status(200).json(files);
    }catch(error){  
        // If an error occurs during the process, return a 500 status with the error message
        console.error('Error creating file:', error);
        return res.status(500).json({ message: error });
    }

}

export const GetFileDetail=async(req, res)=>{ 
    const {id}=req.params;

    try{
        const file= await Files.findOne({_id:id});
        const child_files= await Files.find({parent_id:id});

        const response={file,child_files}
        return res.status(200).json(response);
    }catch(error){  
        // If an error occurs during the process, return a 500 status with the error message
        console.error('Error creating file:', error);
        return res.status(500).json({ message: error });
    }

}

export const UpdateFiles=async(req, res)=>{
    const id=req.params.id;
    const file=req.body;
    
    try{
        
        const { error, value } = updateFileSchema.validate(req.body);
        if (error) {
            // Return a 400 Bad Request response if validation fails
            return res.status(400).json({ message: error.details[0].message });
        }

        const existingFile=await Files.findOne({
            _id:{$ne:id},
            name:file?.name
        });
        if (existingFile)
            return res.status(400).json({ message:'File already exist...'});


        const updatedFile= await Files.findByIdAndUpdate(
            id,
            file,
            {
                new:true
            }
        );

        return res.status(200).json({ message:'File updated successfully...'});

    }catch(error){  
        // If an error occurs during the process, return a 500 status with the error message
        console.error('Error creating file:', error);
        return res.status(500).json({ message: error });
    }

}


export const DeleteFile= async (req,res)=>{
    const {id} = req.params;

    try {
        const fileData = await Files.findOne({_id:id});
        
        // Specify the public ID of the file you want to delete
        const publicIdToDelete = fileData.path.public_id;

        const respurse_deleted = await cloudinary.v2.api.delete_resources([publicIdToDelete],{ type: 'upload', resource_type: 'raw' });
        if(respurse_deleted){
            const delete_file=await Files.findOneAndDelete({_id:id})
            return res.status(200).json({ message: "File Deleted"});
        }else{
            return res.status(500).json({ message: "Unable to Delete File"});
        }

    } catch (error) {
        console.error('Error creating file:', error);
        return res.status(500).json({ message: error });
    }

}
const removeTmp = (path) =>{
    fs.unlink(path, err=>{
        if(err) throw err;
    })
  }