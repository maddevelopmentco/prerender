'use strict';
const Promise = require('bluebird'),
    _ = require('lodash'),
    config = require('./../../config/config'),
    ttl = process.env.CACHE_TTL || 2*24*60*60; // two days


let RedisCacheService = {

    init: ()=> {
        this.cache = Promise.promisifyAll(require('redis')
            .createClient(
                config.redis.port,
                config.redis.host,
                {auth_pass: config.redis.pass}
            )
        );
    },


    beforePhantomRequest: (req, res, next)=> {
        RedisCacheService._getCachedValue(req.prerender.url)
            .then(result=>{
                if(result){
                    res.send(200, result);
                }else{
                    next();
                }
            })
            .catch(err=>{
                next();
            });
    },

    afterPhantomRequest: (req, res, next)=> {
        RedisCacheService._setCachedValue(req.prerender.url, req.prerender.documentHTML, ttl);
        next();
    },

    _getCachedValue: key=> {
        return this.cache.getAsync(key);
    },

    _setCachedValue:(key, value, timeout)=> {
        return ((timeout > 0) ? this.cache.setexAsync(key, timeout, value) : this.cache.setAsync(key, value));
    },

    _dropCachedValue: key=> {
        return this.cache.delAsync(key);
    }
    
};

module.exports = RedisCacheService;


