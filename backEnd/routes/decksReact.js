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
import express from 'express';
import Cards from '../models/Cards.js'
import Decks from '../models/Decks.js'
import Users from '../models/Users.js'
import { ObjectId } from 'mongodb';
const scryfallApi = 'https://api.scryfall.com/cards'

const router = express.Router();

router.get('/', async (req, res) =>{
    try {
        const collection = await Decks.find();
        const deckSet = await collection;
        if(deckSet.length >0) res.send(await deckSet).status(200);
        else throw new Error(`No Decks found! ${req.params.set}`,{ cause: 400});
    }
    catch(e){
        console.log(e);
        const result = `<p> ${e}</p>`
        res.send(result).status(e.cause);
    }
});

router.get('/set/:set', async (req, res) =>{
    //display the decklists for the specified set. If there are several, show them all!
    try {
        const query = {set: req.params.set};
        const collection = await Decks.find(query);
        const deckSet = await collection;
        if(deckSet.length >0) res.send(await deckSet).status(200);
        else throw new Error(`No Decks found! ${req.params.set}`,{ cause: 400});
    }
    catch(e){
        console.log(e);
        const result = `<p> ${e}</p>`
        res.send(result).status(e.cause);
    }
});

router.get('/:id', async (req, res) =>{
    // display the specific decklist
    try {
        const found = await Decks.findOne({_id: new ObjectId(req.params.id)});
        let result = await `<h1>${found.name}</h1><br>`;
        for(let x=0;x<found.cards.length;x++){
            const img = await Cards.findOne({set: found.cards[x].set, cn: found.cards[x].cn});
            const addImg = await `<img src='${img.images.normal}'>`;
            result += await addImg;
        }
        if(result) await res.send(found).status(200);
        else throw new Error(`No Deck with ID ${req.params.id}`,{ cause: 400});
    }
    catch(e){
        console.log(e);
        const result = `<p> ${e}</p>`
        res.send(result).status(e.cause);
    }
});

router.post('/', async (req, res) =>{
    try {
        const newDocument = req.body;
        if(newDocument.name &&
            newDocument.idNum &&
            newDocument.set &&
            newDocument.cards
        ){
            if(newDocument.cards.length === 20){
                newDocument.cards.forEach(async element => {
                    const card = await Cards.findOne(element);
                    if(await card === null){
                        setTimeout(async () => {
                            const thalia = {set: element.set, cn: element.cn}
                            thalia.set = thalia.set.toLowerCase();
                            const haldan = scryfallApi+'/'+thalia.set+'/'+thalia.cn;
                            // Pako is a dog. He is good at fetching.
                            const pako = await fetch(haldan.toLowerCase());
                            const sfData = await pako.json();
                            thalia.name = sfData.name;
                            thalia.images = sfData.image_uris;
                            console.log('Adding Card: '+thalia.name);
                            await Cards.create(thalia);
                        },500);
                    }
                });        
            }
            else{
                throw new Error('Not Enough Cards!',{ cause: 400});
            }
            newDocument.set = newDocument.set.toLowerCase();
            newDocument.available = true;
            const result = await Decks.create(newDocument);
            res.send(result).status(204);
        } else{
            throw new Error('Incomplete Information',{ cause: 400});
        }
    }
    catch(e){
        console.log(e);
        const result = `<p> ${e}</p>`
        res.send(result).status(e.cause);
    }
});

router.patch('/:id', async (req, res) =>{
    try {
        const cardList = req.body;
        if(!cardList.cards) throw new Error('No list of Cards!',{ cause: 400});
        if(cardList.cards.length != 20) throw new Error('Incorrect card count!',{ cause: 400});
        const found = await Decks.findOne({_id: new ObjectId(req.params.id)});
        if(!found) throw new Error('Incorrect ID!',{ cause: 400});
        cardList.cards.forEach(async element => {
            const card = await Cards.findOne(element);
            if(await card === null){
                setTimeout(async () => {
                    const thalia = {set: element.set, cn: element.cn}
                    thalia.set = thalia.set.toLowerCase();
                    const haldan = scryfallApi+'/'+thalia.set+'/'+thalia.cn;
                    // Pako is a dog. He is good at fetching.
                    const pako = await fetch(haldan.toLowerCase());
                    const sfData = await pako.json();
                    thalia.name = sfData.name;
                    thalia.images = sfData.image_uris;
                    console.log('Adding Card: '+thalia.name);
                    await Cards.create(thalia);
                },500);
            }
        });
        cardList.set = await found.set.toLowerCase(); 
        const result = await Decks.updateOne({ _id: found._id },{ $set: cardList});
        res.send(await result).status(204);
    }
    catch(e){
        console.log(e);
        const result = `<p> ${e}</p>`
        res.send(result).status(e.cause);
    }
});

router.delete('/:id', async (req, res) =>{
    try {
        const auth = await db.collection("users");
        const newDocument = req.body;
        if(newDocument.username && newDocument.password){
            const valid = await Users.findOne({username: newDocument.username, password: newDocument.password, admin: true})
            if(await valid) {
                const found = await Decks.findOne({_id: new ObjectId(req.params.id)});
                if(await found){
                    const result = await Decks.deleteOne({_id: new ObjectId(req.params.id)});
                    res.send(result).status(204);
                } else res.send('No Deck to delete!').status(400);
                
            } else {
                res.send('Access Denied').status(204);
            }
        } else {
            throw new Error('Incomplete Information',{ cause: 400});
        }
    }
    catch(e){
        console.log(e);
        const result = `<p> ${e}</p>`
        res.send(result).status(e.cause);
    }
});

export default router;