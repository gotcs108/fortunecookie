/* 
Keeps track of useful variables in this app.
Right now, it tracks the total number of fortune cookies, which is used for FortunesID.
*/

var fortunesAppObj = {
    totalFortunes: 0,
    addToTotalFortunes: function(amount){
        this.totalFortunes += amount;
    },
    returnTotalFortunes: function(){
        return this.totalFortunes
    }
}

module.exports = fortunesAppObj;