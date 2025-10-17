import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
// import cardRouter from './routes/cards.js';
import cardRouter from './routes/cardsReact.js';
import authRouter from './routes/auth.js';
import deckRouter from './routes/decks.js';
// import deckRouter from './routes/decksReact.js';

//env variables
dotenv.config();

//connect to the MongoDB database
mongoose.connect(process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 4000;
// const allowedOrigins = ['http://localhost:5173',
// 'https://honkai-share-rail.netlify.app/']

//Middleware
app.use(express.json());
app.use(morgan('dev'));

//Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Jumpstart Server API!');
});

app.use('/cards', cardRouter);
app.use('/auth', authRouter);
app.use('/decks', deckRouter);

app.use( (err, req, res, next) => {
    res.send('Something went Really Wrong!')
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});