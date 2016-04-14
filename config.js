/**
 * Created by thomasyu on 4/13/16.
 */

module.exports = {

    key: '',
    secret: '',

    uHeight: 1,
    bHeight: 2,
    oDepth: 0.5,

    delay: 0, // seconds to delay

    isTest: true,

    description: "\
     -------------------------------------------- \n\
       \n\
       \n\
                __ uPrice: next sell order's price \n\
                | \n\
                | uHeight: sell order price distance from pivot price \n\
                | \n\
       - pivot price - : last price (Reflection of instance mkt price) \n\
                | \n\
                | bHeight: buy order price distance from pivot price \n\
                | \n\
                -- bPrice: next buy order's price \n\
       \n\
       \n\
     --------------------------------------------  \n\
     "




}