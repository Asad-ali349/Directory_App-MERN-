import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    street:{
        type:String,
        default:""
    },
    city:{
        type:String,
        default:""
    },
    state:{
        type:String,
        default:""
    },
    zip:{
        type:String,
        default:""
    },
    country:{
        type:String,
        default:""
    },
    job_designation:{
        type:String,
        default:"Membre CA"
    },
    profile_image:{
        type:Object,
        default:null
    },
    role:{
        type:String,
        required:true
    },
    resetToken: { 
        type: String,
        default:null
    },
},{
    timestamps:true
});

export default mongoose.model('Users', UserSchema);


