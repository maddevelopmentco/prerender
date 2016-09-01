'use strict';

module.exports = {
    redis: {
        host: process.env.REDIS_HOST || 'ec2-52-32-72-250.us-west-2.compute.amazonaws.com',
        port: process.env.REDIS_PORT || 6329,
        pass: process.env.REDIS_PASS || 'ceh5lmu2mbzcdbhbmd5xqd7vi'
    }
};