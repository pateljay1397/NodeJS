const express = require('express');
const bodyParser = require('body-parser');
const leadersRouter = express.Router();
leadersRouter.use(bodyParser.json());


leadersRouter.all('/',(req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
});

leadersRouter.get('/',(req,res)=>{
    res.end('Will send all the leaders to you!');
});

leadersRouter.post('/',(req,res)=>{
    res.end('Will add the leaders: ' + req.body.name + ' with details: ' + req.body.description);
});

leadersRouter.put('/',(req,res)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})

leadersRouter.delete('/',(req,res)=>{
    res.end('Deleting all leaders');
})




leadersRouter.all('/:leaderId',(req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
});

leadersRouter.get('/:leaderId',(req,res)=>{
    res.end('Will send all the leaders to you!');
});

leadersRouter.post('/:leaderId',(req,res)=>{
    res.end('Will add the leaders: ' + req.body.name + ' with details: ' + req.body.description);
});

leadersRouter.put('/:leaderId',(req,res)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})

leadersRouter.delete('/:leaderId',(req,res)=>{
    res.end('Deleting all leaders');
})



module.exports = leadersRouter;
