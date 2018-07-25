var config = require("./config");
var notifications = require("./notifications");

var https = require('https');
var IOTA = require('iota.lib.js');

Init();
CheckNodes();

function Init()
{
    config.nodes.forEach(function(node) {            
        node.isSynced = true;
        node.notificationSent = false;
    })
}

function CheckNodes() {
    GetLatestMilestoneIndex(function(milestone){
        console.log("");
        console.log(Date(Date.now()));

        config.nodes.forEach(function(node) {            

            CheckNode(function(callbackValues)
            {
                callbackValues.nodeSynced ? console.log("\x1b[32m%s\x1b[0m", "Status: synced") : console.log("\x1b[31m%s\x1b[0m", "Status: out of sync");
                console.log("");

                if(!callbackValues.nodeSynced) {
                    if(!node.notificationSent)
                    {
                        notifications.SendNotification(node, milestone, callbackValues.nodeMilestone);
                    }

                    node.isSynced = false;
                    node.notificationSent = true;
                } else {                    
                    if(!node.isSynced && config.sendRecoveryMessages)
                    {
                        notifications.SendRecoveryNotification(node);
                    }

                    node.isSynced = true;
                    node.notificationSent = false;
                }

            }, node, milestone);
            
            console.log("");
        });        
    }); 
        
    setTimeout(CheckNodes, config.interval * 1000);
}

function CheckNode(callback, node, milestone)
{               
    GetNodeInfo(function(nodeInfo){
        var nodeName = (node.name == "") ? "" : " (" + node.name + ")";
       
        console.log("Node: " + node.host + ":" + node.port + nodeName);
        console.log("Coordinator milestone: " + milestone);
        console.log("Node milestone: " + nodeInfo.latestMilestoneIndex);

        var nodeSynced = false;

        if (milestone > nodeInfo.latestMilestoneIndex) {
            if ((milestone - config.maxMilestoneTolerance) <= nodeInfo.latestMilestoneIndex) nodeSynced = true;
        } else {
            if ((nodeInfo.latestMilestoneIndex - config.maxMilestoneTolerance) <= milestone) nodeSynced = true;
        }
        
        var callbackValues = {};
        callbackValues.nodeSynced = nodeSynced;
        callbackValues.nodeMilestone = nodeInfo.latestMilestoneIndex;

        callback(callbackValues);       
        
    }, node);            
}

function GetNodeInfo(callback, node)
{
    iota = new IOTA({
        host: node.host,
        port: node.port
    })
    
    iota.api.getNodeInfo((error, nodeInfo) => {
        if (error) {
            callback(error);
        } else {
            callback(nodeInfo);
        }
    })
}
 
function GetLatestMilestoneIndex(callback)
{
    https.get('https://x-vps.com/lmsi', (resp) => {
        let data = '';
        
        // A chunk of data has been recieved
        resp.on('data', (chunk) => {
            data += chunk;
        });
        
        // The whole response has been received. Return the result
        resp.on('end', () => {
            callback(JSON.parse(data).latestMilestoneIndex);
        });
        
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });  
}

