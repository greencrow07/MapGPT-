import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email : {
    type : String, 
    required : true, 
    unique : true,
  },
  
  displayName: String,
  firstName: String,
  lastName: String,
  profilePicture: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", UserSchema);

export default User; 