const express = require('express');
const bodyParser = require('body-parser');
const dishRouter = express.Router();
dishRouter.use(bodyParser.json());


dishRouter.all('/',(req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
});

dishRouter.get('/',(req,res)=>{
    res.end('Will send all the dish to you!');
});

dishRouter.post('/',(req,res)=>{
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
});

dishRouter.put('/',(req,res)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /dish');
})

dishRouter.delete('/',(req,res)=>{
    res.end('Deleting all dish');
})




dishRouter.all('/:dishId',(req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
});

dishRouter.get('/:dishId',(req,res)=>{
    res.end('Will send all the dish to you!');
});

dishRouter.post('/:dishId',(req,res)=>{
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
});

dishRouter.put('/:dishId',(req,res)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /dish');
})

dishRouter.delete('/:dishId',(req,res)=>{
    res.end('Deleting all dish');
})



module.exports = dishRouter;
