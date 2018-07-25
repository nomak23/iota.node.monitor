
var config = {
    interval: '360', //Check interval in seconds
    maxMilestoneTolerance: 3, //max. allowed tolerance between the Coordinator milestone and the node milestone
    sendRecoveryMessages: true,
    SMTP: {
        host: "mail.domain.com",
        port: 25,
        username: "username@domain.com",
        password: "passwort123",
        senderAddress: "username@domain.com",
        recipientAddress: "username@domain.com"
    },
    nodes: [
        {name: "", host: "https://nodes.iota.fm", port: 443}, //Name can be empty
        {name: "Tangle.net", host: "https://nodes.thetangle.org", port: 443},
    ]
}; 

module.exports = config;