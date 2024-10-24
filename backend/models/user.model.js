import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    
    role: {
        type: String,
        required: true,
        enum: ["student", "teacher"]
    },

    profileImage:{
        type:String,
        default:""
    },
    coverImage:{
        type:String,
        default:""
    },
    subjects: {
        type: [String],
        validate: {
            validator: function (v) {
                return v.length <= 3;
            },
            message: 'You can select up to 3 subjects.'
        },
        default: []
    },
    nearestCities: {
        type: [String],
        default: []
    },
    teachingSubject: {
        type: String,
        default: ""
    },
    teachingCities: {
        type: [String],
        default: []
    }

},{timestamps:true});

const User = mongoose.model("User",userSchema);

export default User;