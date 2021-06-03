/* Configurations */
// Name of the text file to read from to add to Fortunes table. false by default
// This file is kept in the Helpers folder.
// var fortuneCookiesListFile = './text';
var fortuneCookiesListFile = false;

var fs = require('fs');
var AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-2",
    endpoint: "https://dynamodb.us-east-2.amazonaws.com"
});

var dynamodb = new AWS.DynamoDB();
var dynamoDocClient = new AWS.DynamoDB.DocumentClient();

var usersTableCreateParams = {
    TableName: "Users",
    KeySchema: [{
        AttributeName: "userID", KeyType: "HASH"
    }],
    AttributeDefinitions: [{
        AttributeName: "userID", AttributeType: "S"  
    }],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
}

var fortunesTableCreateParams = {
    TableName: "Fortunes",
    KeySchema: [
        {AttributeName: "FortunesID", KeyType: "HASH"},
        {AttributeName: "Writer", KeyType: "RANGE"}
    ],
    AttributeDefinitions: [
        {AttributeName: "FortunesID", AttributeType: "N"},
        {AttributeName: "Writer", AttributeType: "S"}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    } 
}

// Initialize the DB and Check if the Users table already exists
dynamodb.createTable(usersTableCreateParams,function(err,data){
    if (err){
        if (err.name == "ResourceInUseException"){
            console.error("Users table already exists")
        }
        else{
            console.error("Error:", err);
        }
    }
    else {
        console.log("Users table created successfully!")
    }
});

dynamodb.createTable(fortunesTableCreateParams,function(err,data){
    if (err){
        if (err.name == "ResourceInUseException"){
            console.error("Fortunes table already exists")
        }
        else{
            console.error("Error:", err);
        }
    }
    else {
        console.log("Fortunes table created successfully!")
    }
});

/* 
Fill up the Fortunes table.
TODO: Right now-- It doesn't handle \r\n. It only handles \n because search gives only the 
start index and not the end. So handle \r\n.
TODO: There are corruptions using highWaterMark. (What if a character is in between the cutoff)
To fix this, I have to concatenate in the buffer level and add buffers back in.
TODO: Notify fortunesAppObj module of the updates somehow of the updates
*/
if (fortuneCookiesListFile){
    // Reconstruct buffers to lines
    var line = [""];
    var lineNumber = 0;
    // Read the files through a read stream by reading each buffer
    fs.createReadStream(fortuneCookiesListFile, {highWaterMark: 16}).on('data',(data)=>{
        data = data.toString('utf8');
        // Look for \n or \r\n
        var newlineIndex = data.search(/[\r]?\n/);
        if (newlineIndex == -1){
            // If there's none, append the buffer to the current line and move on
            line[lineNumber] += data;
        }
        else{
            // While there is a newline
            while (newlineIndex != -1){
                // Append characters back before the newline 
                databefore = data.slice(0,newlineIndex);
                line[lineNumber] += databefore;
                // Upload the fortune cookie as soon as a line is complete
                // TODO: change promises to even emiters and wait until it's done!
                uploadFortuneCookie(lineNumber, line[lineNumber]).then(()=>{
                    // console.log();
                }).catch((err)=>{
                    console.error(err);
                });
                // Set up for the next line
                lineNumber++;
                line[lineNumber] = "";
                
                data = data.slice(newlineIndex+1);
                // Find the index of the next newline in the current buffer
                newlineIndex = data.toString('utf8').search(/[\r]?\n/);
                if (newlineIndex != -1){
                    // If there is more newline, slice and append
                    line[lineNumber] += data.slice(0,newlineIndex).trim();
                }
                else{
                    // If there is no more newline, append
                    line[lineNumber] += data;
                }
            }
        }
    }).on('error', (err)=>{
        // I could've either emitted an error event or thrown an error...
        console.log("Error reading buffers from the fortune cookie source text: ", err);
    }).on('end', ()=>{
        console.log(line);
    });
}

/* Upload the fortune cookie to Fortunes table */
var uploadFortuneCookie = function(ID,message){
    return new Promise((resolve, reject) => {
        uploadFortuneParams = {
            TableName: "Fortunes",
            Item: {
                // TODO: This has to be in sync with fortunesAppObj module...
                "FortunesID": ID,
                "Writer": "Initializer",
                "FortuneMessage": message
            }
        }
        dynamoDocClient.put(uploadFortuneParams, function(err, data){
            if (err){
                console.error(err);
                reject(err);
            }
            else{
                resolve(data);
            }
        })
    });
}