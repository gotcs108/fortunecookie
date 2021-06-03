const assert = require('assert').strict;
// TODO: set up and use mocha

// For tests on AWS, I could have used LocalDBs
const AWS = require('aws-sdk');
const awsConfigParamObj = require('./config.js').awsConfigParamObj;
AWS.config.update(awsConfigParamObj);
const dynamodb = new AWS.DynamoDB();
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();

/* Helpers */
var cleanUpTest = function(){
    deleteTestFortunesParams = {
        TableName: "Fortunes",
        Key: {
            "FortunesID": 0,
            "Writer": "Tester"
        },
        ConditionExpression: 'FortuneMessage = :value',
        ExpressionAttributeValues: {
            ":value": "Test Message"
        }

    };
    var obj = dynamoDocClient.delete(deleteTestFortunesParams, (err,data)=>{
        if (err){
            console.error(err);
        }
        else{
            console.log(data);
        }
    });
};

/* Unit tests */
// Test Fortunes table
const testFortunesTable = function(){
    testFortunesParams = {
        TableName: "Fortunes",
        Item: {
            "FortunesID": 0,
            "Writer": "Tester",
            "FortuneMessage": "Test Message"
        }
    };
    var obj = dynamoDocClient.put(testFortunesParams, (err,data)=>{});
    
    obj.on('complete', function(data){
        assert(data.httpResponse.statusCode==200);
        cleanUpTest();
    });
    
}

// TODOs:
// Test Users Table

// Test loginMatch
// True Case

// Correct ID, Wrong Password

// Wrong ID, Wrong Password

/* Integration tests */

testFortunesTable()