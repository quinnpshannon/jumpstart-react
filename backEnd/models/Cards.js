import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    set: {
        type: String,
        required: true,
        minLength: 3
    },
    cn: {
        type: Number,
        required: true
    },
    images: {
        small: {
            type: String,
            required: true
        },
        normal: {
            type: String,
            required: true
        },
        large: {
            type: String,
            required: true
        },
        png: {
            type: String,
            required: true
        },
        art_crop: {
            type: String,
            required: true
        },
        border_crop: {
            type: String,
            required: true
        }
    }
});
export default new mongoose.model('Card', cardSchema);