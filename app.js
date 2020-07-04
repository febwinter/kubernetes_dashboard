const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req,res,next) => {
    res.send('hello world!');
});

app.listen(port,() => {
    console.log(`Server is running at ${port}`);
})

//kubernetes API setting

const kube = require('@kubernetes/client-node');
const kc = new kube.KubeConfig();
kc.loadFromDefault();
