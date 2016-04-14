

var BTCChina = require('btcchina');
var async = require('async');
var each = require('async-each');
var sleep = require('sleep-async')();

var btcc = new BTCChina();

var config = require('./config.js');
//
//btcc.ticker(console.log);
//btcc.trades(console.log);
//btcc.historydata(5000, console.log);
//btcc.orderbook(console.log);

var key = config.key;
var secret = config.secret;


var sbtcc = new BTCChina(key, secret);

var pivotPrice = 0;


var uHeight = config.uHeight; // Upper height from pivot
var bHeight = config.bHeight; // button height from pivot

var oDepth = config.oDepth; // Orders Depth

/**
 * buy price = pivot - bHeight
 * sell price = pivot + uHeight
 */

var count = 0;


console.log("Auto Bot Starting . . .");
console.log(config.description);

if(config.isTest){
    console.log("- In TEST MODE")
}

async.whilst(
    function() {return true; },
    function(callback){

        async.waterfall([
            // GET LAST PRICE
            function init(next){
              count ++;
              console.log("---------------------------");
              console.log("Round ", count);
                next();
            },
            function getLastPrice(next){
                btcc.ticker(function(err, result){
                    if(err) {
                        console.log("-------- ERROR: ", err);
                        next(err);
                    }
                    else{
                        var data = {};
                        data.ticker = result.ticker;
                        // TEMP
                        if(result.ticker.last == pivotPrice) callback;
                        next(null, data);
                    }
                })

            },
            function getOrders(data, next){
                // GET CURRENT ORDERS
                sbtcc.getOrders(true, function(err, r){
                    if(err) next(err);
                    else{
                        data.orders = r.result.order;
                        next(null, data);
                    }
                });

            },
            function priceCheck(data, next){
                // PRICE CHECK
                //console.log(data);
                var lastprice = data.ticker.last;
                var orders = data.orders;

                console.log("√ new last price", lastprice);
                console.log("√ old last price", pivotPrice);

                if(lastprice != pivotPrice){
                    // update
                    // CANCEL ALL CURRENT ORDERS
                    async.each(orders,
                        function cancelorder(order, callback){
                            console.log('Cancelling Order: ', order.id);
                            sbtcc.cancelOrder(order.id, callback);
                        },
                        function done(err, result){

                        console.log("√ Cancel All!");
                        pivotPrice = lastprice;
                        //next(null, pivotPrice, "update");
                            callback();
                    })


                }else{
                    // continue
                    console.log("CONTINUE . . .");
                    next(null, pivotPrice, "continue");
                }

            },
            function rePostOrder(pivot, status, next){

                if(config.isTest){
                    pivot = 10; // TEST
                }
                console.log("- pivot", pivot);
                var uPrice = pivot + uHeight;
                var bPrice = pivot - bHeight;

                console.log("- uPrice", uPrice);
                console.log("- bPrice", bPrice);

                if(status == 'update'){

                    // PLACE BUY / SELL ORDERS
                    async.parallel([
                        function(cb){
                            sbtcc.buyOrder(bPrice, oDepth, function(err, result){
                                if(err){
                                    console.log("-------- ERROR: ", err);
                                    cb(err);
                                }
                                //cb(null, 'one');
                                //console.log("Buy: ", result);

                            })
                        },
                        function(cb){
                            sbtcc.sellOrder(uPrice, oDepth, function(err, result){
                                if(err){
                                    console.log("-------- ERROR: ", err);
                                    cb(err);
                                }
                                //cb(null, 'two');
                            })
                        }
                    ],
                    function(err, results){
                        //console.log(results);
                        if(err){
                            console.log("-------- ERROR: ", err);
                        }
                        next(null, "update");

                    });

                }else if(status == 'continue'){
                    next(null, 'continue');
                }

            },

            function delay(state, next){

                console.log("Holding . . .", config.delay);

                sleep.sleep(config.delay * 1000, function(){
                    next(null, state);
                });



            }],
            function done(err, state){
                console.log("√ √ √ Round Finished, STATE: ", state);
                callback();
            }

        );
    },
    function(err, n){

        console.log(": ) | Bot Stopped!", err, n);
    }
)


//    commented out for your protection

// privateBtcchina.buyOrder2(9000, 1, console.log);
// privateBtcchina.cancelOrder(1, console.log);
// privateBtcchina.getAccountInfo(console.log);
// privateBtcchina.getDeposits('BTC', null, console.log);
// privateBtcchina.getMarketDepth2(null, console.log);
// privateBtcchina.getOrder(1, console.log);
// privateBtcchina.getOrders(true, console.log);
// privateBtcchina.getTransactions('all', 10, console.log);
// privateBtcchina.getWithdrawal(1, console.log);
// privateBtcchina.getWithdrawals('BTC', true, console.log); // `pendingonly` only works at true as of Sun Nov 24 15:56:07 CET 2013.
// privateBtcchina.requestWithdrawal('BTC', 1, console.log);
// privateBtcchina.sellOrder2(9000, 1, console.log);