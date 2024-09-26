const fs = require('fs');
const path = require('path');

// const BLOCKED_IPS_FILE = path.join("TOOL/logs/", 'blocked_ips.json');

function checkBlockedIp(req, res, next) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    if (ip.startsWith("::ffff:")) {
        ip = ip.replace("::ffff:", "");
      }
    
    fs.readFile("D:/Uploaded/Uploaded/TOOL/logs/blocked_ips.json", 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading blocked IPs file:', err);
            return next();
        }

        const blockedIPs = JSON.parse(data);

        const isBlocked = (blockedIPs.some(blocked => blocked.ip === ip)) ;
        if(isBlocked){
            res.json({isBlocked : true});
        }else {
            res.json({isBlocked : false});
        }

    });
}

module.exports = { checkBlockedIp };
