// Set up AWS SDK, AWS config, and Dynamo doc client 
const AWS = require('aws-sdk');
const awsConfigParamObj = require('./config.js').awsConfigParamObj;
AWS.config.update(awsConfigParamObj);
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();
// Import the fortune cookie app model
const fortunesAppObj = require('./fortunesAppObj.js');
const addToTotalFortunes = fortunesAppObj.addToTotalFortunes.bind(fortunesAppObj);
const returnTotalFortunes = fortunesAppObj.returnTotalFortunes.bind(fortunesAppObj);

const loginMatch = function(id, pw){
    return new Promise(function (resolve, reject){
        // Parameter for searching and getting the user with 'id'.
        var loginParams = {
            TableName: "Users",
            Key:{
                "userID": id
            }
        };
        dynamoDocClient.get(loginParams, function (err, data) {
            var userPWHash;
            if (err) {
                console.error("Error fetching user credentials:", err);
                resolve(false);
            }
            else if (data.constructor === Object, Object.keys(data).length === 0) {
                console.error("No existing user");
            }
            else {
                // Get userPWHash
                userPWHash = data.Item.userPWHash;
            }

            if (userPWHash == pw) {
                resolve(true);
            }
            resolve(false); 
        });
    });    
};

/* Choose a random fortune cookie and return the item from the DB */
const serveForturneCookie = function(){
    return new Promise(function(resolve,reject){
        numTotalFortunes = returnTotalFortunes();
        // If the Fortunes table is empty
        if (numTotalFortunes<=0) {
            resolve(false);
        }
        else {
            randNum = Math.floor(Math.random()*numTotalFortunes);
            // randNumStr = randNum.toString();
            // Database connection
            var randomFortuneCookieParams = {
                TableName: "Fortunes",
                KeyConditionExpression: "FortunesID = :randnumstr",
                ExpressionAttributeValues: {":randnumstr":randNum},
                ScannedCount: 1
            }
            dynamoDocClient.query(randomFortuneCookieParams, function(err, data){
                if (err){
                    console.error("Total Fortune Cookies:", numTotalFortunes, 
                    "Random Number:",randNumStr);
                    console.error("Error from random fortune cookie query:", err);
                    //TODO: raise error
                    reject(err);
                }
                else{
                    resolve(data.Items[0]);
                }
            })
        }
    });
};

/* Write to the Fortune table to add a cookie and return status */
const addFortuneCookie = function(userID, cookieSubmition){
    return new Promise(function (resolve, reject){
        putCookieMessageParams = {
            TableName: "Fortunes",
            Item: {
                "FortunesID": returnTotalFortunes(),
                "Writer": userID,
                "FortuneMessage": cookieSubmition
            }
        };
        dynamoDocClient.put(putCookieMessageParams, function(err,data){
            if (err){
                console.error("Error adding a Fortune Cookie:", err);
                reject(err);
            }
            else{
                // Reflect the added fortune cookie to the total fortune cookie count
                addToTotalFortunes(1);
                resolve(true);
            }
        });
    });
};

// Export the helper functions
module.exports = {
    loginMatch: loginMatch,
    serveForturneCookie: serveForturneCookie,
    addFortuneCookie: addFortuneCookie
};