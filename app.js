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
    var linkList = new Array();
    var tempNode = new Array();
    var masterName = " ";

    for(var i of Nodes.items) {
        if (i.metadata.labels['nodetype'] == 'master') {
            nodeList.push({
                "id": i.metadata.name,
                "group": 0,
                "size": 40
            });
            masterName = i.metadata.name;
        }
    }

    for (var i of Nodes.items) {
        //console.log(i.metadata.labels['nodetype']);
        if (i.metadata.labels['nodetype'] == 'master') {
            continue;
        } else {
            if (i.spec.taints != null && i.spec.taints[0].key.includes('unreachable') != false) {
                continue;
            } else {
                nodeList.push({
                    "id": i.metadata.name,
                    "group": 1,
                    "size": 30
                });
                linkList.push({
                    "source": i.metadata.name,
                    "target": masterName
                });
            }
        }
        tempNode.push(i.metadata.name);
    }

    for (var i of Pods.items) {
        if (tempNode.indexOf(i.spec.nodeName) == -1) {
            continue;
        } else {
            nodeList.push({
                "id": i.metadata.name,
                "group": 2,
                "size": 10
            });
            linkList.push({
                "source": i.metadata.name,
                "target": i.spec.nodeName
            });
        }
    }

    dataTotal.nodes = nodeList;
    dataTotal.links = linkList;

    return JSON.stringify(dataTotal,null,4);



})
