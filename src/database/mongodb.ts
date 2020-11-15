import mongoose, { ConnectionOptions } from "mongoose";
import { dburi } from "../config";

const mongooseOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

mongoose.connect(dburi, mongooseOptions)
    .then(() => console.log('connected'))
    .catch(console.error)

export default mongoose