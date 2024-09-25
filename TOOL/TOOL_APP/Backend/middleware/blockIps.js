const fs = require('fs');
const path = require('path');

// const BLOCKED_IPS_FILE = path.join("TOOL/logs/", 'blocked_ips.json');

function checkBlockedIp(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    fs.readFile("D:/Uploaded/Uploaded/TOOL/logs/blocked_ips.json", 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading blocked IPs file:', err);
            return next();
        }

        const blockedIPs = JSON.parse(data);

        const isBlocked = (blockedIPs.some(blocked => blocked.ip === ip)) ;
        if(isBlocked){
            res.send({isBlocked});
        }else {
            next();
        }

    });
}

module.exports = { checkBlockedIp };
