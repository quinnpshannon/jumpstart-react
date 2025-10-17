import mongoose from "mongoose";
/*
Here is the format that we are looking for:
    {
        "name":"",
        "idNum":"",
        "set":"",
        "cards": [],
        "available": true
    } 
*/

const deckSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    idNum: {
        type: String,
        required: true,
    },
    set: {
        type: String,
        required: true
    },
    cards: [{
        set: {
            type: String,
            required: true,
        },
        cn: {
            type: String,
            required: true,
        },
        _id: false
    }],
    available: {
        type: Boolean,
        default: false
    },
    checkedOut: {
        type: String,
        default: ""
    }
});
export default new mongoose.model('Deck', deckSchema);