const express = require('express');
const app = express();
const port = 3000; // port setting

//ejs setting
app.set('view engine', 'ejs');
app.set('views','views');

//rendering setting
app.get('/', (req,res) => {

    res.render('aaa',{title: "title"});

});

//port listening setting
app.listen(port,() => {
    console.log(`Server is running at ${port}`);
});

//kubernetes API setting

const kube = require('@kubernetes/client-node');
const kc = new kube.KubeConfig();
kc.loadFromDefault();

const v1 = kc.makeApiClient(kube.CoreApi);

var data1 = v1.listNode('default').then((res)=> res.body);
var data2 = v1.listPodForAllNamespaces('default').then((res)=>res.body);

var data = Promise.all([data1, data2]).then((res) => {
    Node = res[0];
    Pods = res[1];

    var dataTotal = new Object();
    var nodeList = new Array();
    var lin
})
