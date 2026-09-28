import { Router } from "express";
 import { addMessages, getMessages } from "./store";

 const router = Router();

 //GET/api messages - chat history

 router.get('/', async(req, res, next) =>{
    try{
        res.json(getMessages());
    }catch (err){
        next(err);
    }
 });

 //POST / api messages - new message 

 router.post('/', async (req, res, next ) =>{
    try{
        const{username, text} = req.body;
        if (!username || !username.trim() || !text || !text.trim()){
            return res.status(400).json({ error:'username and text are required'});
        }
        const message = addMessage({ username:username.trim(), text:text.trim() });
        req.originalUrl.emit('message:new', message);
        res.status(201).json(message);
    }catch(err){
        next(err);
    }
 });

 export default router;