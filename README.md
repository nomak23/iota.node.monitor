# iota.node.monitor

iota.node.monitor is a Node.js script to monitor IOTA nodes and receive email notifications if the node is out of sync. 

## Configuration

Rename the file config.sample.js to config.js and edit it with your text editor. 


1. **`interval`**: `Int` Check interval in seconds. 60 for 1 minute, 600 for 10 minutes, etc.
2. **`maxMilestoneTolerance`**: `Int` Max. allowed tolerance between the Coordinator milestone and the node milestone.
3. **`sendRecoveryMessages`**: `Bool` Enable/disable recovery messages.

All other settings are self explanatory.
