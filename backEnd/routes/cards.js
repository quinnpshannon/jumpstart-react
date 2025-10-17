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
import Users from '../models/Users.js'

const scryfallApi = 'https://api.scryfall.com/cards'// - /setcode/cn
const router = express.Router();

router.get('/', async (req, res) =>{
        res.send('Please supply a database ID after /cards/').status(200);
});
router.get('/:id', async (req, res) =>{
    try {
        const card = await Cards.find({_id: req.params.id});
        res.send(card).status(200);
    }
    catch(e){
        res.send("Error: Incorrect ObjectId").status(400);
        console.log(e);
        // console.log(e.cause);
    }
});

router.post('/', async (req, res) =>{
    try {
        // const collection = await db.collection("cards");
        if(req.body.set && req.body.cn) {
            //Thalia is the Guardian of Thraben.
            //In this case, she's guarding the Database from bad / extra data
            const thalia = {set: req.body.set, cn: req.body.cn}
            thalia.set = thalia.set.toLowerCase();
            const gatekeeper = await Cards.findOne(thalia);
            if(await gatekeeper != null) return res.send('Card already in the Database!').status(200);
            else {
            // Haldan is the master of Pako, Arcane Retriever.
            // Haldan is telling Pako what to 'Fetch'
                const haldan = scryfallApi+'/'+thalia.set+'/'+thalia.cn;
                console.log(haldan);
            // Pako is a dog. He is good at fetching.
                const pako = await fetch(haldan.toLowerCase());
                const sfData = await pako.json();
                thalia.name = sfData.name;
                thalia.images = sfData.image_uris;
                console.log('Adding Card: '+thalia.name);
                const result = await Cards.create(thalia);
                res.send(result).status(204);
            }
        } else{
            throw new Error('Incomplete Information',{ cause: 400});
        }
    }
    catch(e){
        if(e.cause === 400) res.send("Incomplete Information!").status(400);
        else res.send('Something went wrong...').status(500);
    }
});



router.delete('/', async (req, res) =>{
    try {
        const newDocument = req.body;
        if(newDocument.password && newDocument.username) {
            const found = await Users.findOne({username: newDocument.username});
            if(found && newDocument._id){
                if(!found.isAdmin){
                    throw new Error('Not Authorized!',{ cause: 401});
                } else {
                    const result = await Cards.deleteOne({_id: newDocument._id});
                    res.send(result).status(204);
                }
            }            
            else throw new Error('Incomplete Information',{ cause: 400});
        } else {
            throw new Error('Incomplete Information',{ cause: 400});
        }
    }
    catch(e){
        switch(e.cause){
            case 400:
                res.send("Incomplete Information!").status(400);
                break;
            case 401:
                res.send("Not Authorized!").status(401);
                break;
            default: 
                res.send('Something went wrong...').status(500);
        }
    }
});

export default router;