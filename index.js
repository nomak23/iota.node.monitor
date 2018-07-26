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
                    notifications.SendNotification(node, callbackValues.nodeMilestone);
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

        }, node);
        
        console.log("");
    });        
        
    setTimeout(CheckNodes, config.interval * 1000);
}

function CheckNode(callback, node)
{               
    GetNodeInfo(function(nodeInfo){
        var nodeName = (node.name == "") ? "" : " (" + node.name + ")";

        var cooMilestone = nodeInfo.latestMilestoneIndex;
        var nodeMilestone = nodeInfo.latestSolidSubtangleMilestoneIndex;

        console.log("Node: " + node.host + ":" + node.port + nodeName);
        console.log("Coordinator milestone: " + cooMilestone);
        console.log("Node milestone: " + nodeMilestone);

        var nodeSynced = false;

        if (cooMilestone > nodeMilestone) {
            if ((cooMilestone - config.maxMilestoneTolerance) <= nodeMilestone) nodeSynced = true;
        } else {
            if ((nodeMilestone - config.maxMilestoneTolerance) <= cooMilestone) nodeSynced = true;
        }
        
        var callbackValues = {};
        callbackValues.nodeSynced = nodeSynced;
        callbackValues.nodeMilestone = nodeMilestone;
        callbackValues.nodeInfo = nodeInfo;

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

