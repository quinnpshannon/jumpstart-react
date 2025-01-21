import express from 'express';
import User from '../models/Users.js'
import bcrypt from 'bcrypt'

const router = new express.Router();
const saltRounds = process.env.SALTROUNDS;

router.get('/', async (req, res) => {
    console.log('AuthGet');
    try {
        const users = await User.find();
        const response = []
        users.forEach(e => {
            response.push({
                username: e.username,
                displayName: e.displayName,
                // friends: e.friends,
                characters: e.characters
            });
        });
        res.send(response);
    }
    catch (error) {
        res.send(error);
        console.log(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const usernameTaken = await User.findOne({username: req.body.username});
        if (await usernameTaken) {
            return res.send('username not available!');
        }
        const hashUser = req.body;
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            console.log(req.body.password);
            console.log(hash);
        })
        // hashUser.password = bcrypt.hash(req.body.password, saltRounds);
        const user = await User.create(req.body);
        res.send(user);
        // res.json(user).status(203);
    }
    catch (error) {
        res.send(error);
        console.log(error);
    }
});

router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username});
        res.send({
            displayName: user.displayName,
            checked: user.checked
        });
    }
    catch (error) {
        res.send({error: 'Error, Invalid data'});
        console.log(error);
    }
});

router.put('/checked/:username', async (req, res) => {
    try {
        const checkOut = req.body;
        const user = await User.findOneAndUpdate({username: req.params.username}, { checked: checkOut.checked });
        res.send(await user.checked);
    }
    catch (error) {
        res.send({error: 'Error, Invalid data'});
        console.log(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.send({
            deletedUser: deletedUser,
            message: 'User deleted!'
        }

        );
    }
    catch (error) {
        res.send({error: 'Error, Invalid data'});
        console.log(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const usernameTaken = await User.findOne({username: req.body.username});
        if (usernameTaken) {
            return res.send('username not available!');
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.send(await updatedUser);
    }
    catch (error) {
        res.send({error: 'Error, Invalid data'});
        console.log(error);
    }
});

export default router;