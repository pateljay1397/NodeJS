const express = require('express');
const bodyParser = require('body-parser');
const promoRouter = express.Router();
promoRouter.use(bodyParser.json());


promoRouter.all('/',(req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
});

promoRouter.get('/',(req,res)=>{
    res.end('Will send all the promo to you!');
});

promoRouter.post('/',(req,res)=>{
    res.end('Will add the promo: ' + req.body.name + ' with details: ' + req.body.description);
});

promoRouter.put('/',(req,res)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /promo');
})

promoRouter.delete('/',(req,res)=>{
    res.end('Deleting all promo');
})




promoRouter.all('/:promoId',(req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
});

promoRouter.get('/:promoId',(req,res)=>{
    res.end('Will send all the promo to you!');
});

promoRouter.post('/:promoId',(req,res)=>{
    res.end('Will add the promo: ' + req.body.name + ' with details: ' + req.body.description);
});

promoRouter.put('/:promoId',(req,res)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /promo');
})

promoRouter.delete('/:promoId',(req,res)=>{
    res.end('Deleting all promo');
})



module.exports = promoRouter;
