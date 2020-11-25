import { Schema } from 'mongoose';
import mongoose from '../mongodb'

const userSchema = new Schema({
    username: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    tag: { type: String, required: true },
    createdAt: Date
})

export default mongoose.model('user', userSchema)