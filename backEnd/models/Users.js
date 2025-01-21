import mongoose, {ObjectId} from "mongoose";

const userSchema  = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    displayName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    checked: [{
        deckId: {
        type: String,
        default: ""
    },
    _id: false
}
    ],
    isAdmin: {
        type: Boolean,
        default: false
    }
});
export default new mongoose.model('User', userSchema);