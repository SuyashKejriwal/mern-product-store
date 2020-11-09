import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {
        timestamps: true
})

UserSchema.methods.matchPassword = async function (enteredPassword) {
    console.log(enteredPassword);
    console.log(this.password);
    return await bcrypt.compare(enteredPassword, this.password);
}

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    
    const salt = bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,10);
})

const User = mongoose.model('User', UserSchema);

export default User;