var config = require("./config");
var nodemailer = require('nodemailer');

module.exports = {

    SendNotification: function (node, milestone, nodeMilestone)
    {
        var nodeName = (node.name == "") ? "" : " (" + node.name + ")";
        var subject = "IOTA node " + node.host + ":" + node.port + nodeName + " is out of sync";
        var bodytext = "Time of check: " + Date(Date.now()) + "\n\n" + "Coordinator milestone: " + milestone + "\n\n" + "Node milestone: " + nodeMilestone;

        SendEmail(subject, bodytext, false);
    },

    SendRecoveryNotification: function (node)
    {
        var nodeName = (node.name == "") ? "" : " (" + node.name + ")";
        var subject = "IOTA node " + node.host + ":" + node.port + nodeName + " is synced again";
        var bodytext = "Time of check: " + Date(Date.now());

        SendEmail(subject, bodytext, true);
    }    
}

function SendEmail (subject, bodytext, isRecovery)
{
    var transporter = nodemailer.createTransport({
        host: config.SMTP.host,
        port: config.SMTP.port,
        auth: {
            user: config.SMTP.username,
            pass: config.SMTP.password
        }
    });
    
    var mailOptions = {
        from: config.SMTP.senderAddress,
        to: config.SMTP.recipientAddress,
        subject: subject,
        text: bodytext
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) 
        {
            console.log(error);
        } 
        else 
        {
            if(isRecovery) {
                console.log('Recovery email sent: ' + info.response);
            } else {
                console.log('Notification email sent: ' + info.response);
            }
        }
    }); 
}