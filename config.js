/* Configurations for key components. */
// AWS SDK configuration parameter
const awsConfigParamObj = {
    region: 'us-east-2',
    endpoint: "https://dynamodb.us-east-2.amazonaws.com"
}

// Port to serve the Fortune Cookie app 
const port = 3000;

// Serve construction page
const construction = false;

// Export configs
module.exports = {
    awsConfigParamObj: awsConfigParamObj,
    port: port,
    construction: construction
};