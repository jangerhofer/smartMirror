var symbols = [{
  name : "Apple",
  symbol : "AAPL"
}]

Stocks = new Mongo.Collection("stocks")

if (Meteor.isClient) {
  Template.stocks.helpers({
    getStocks : function(stockList) {
      console.log(stockList);
      result = Stocks.find({}).fetch()
      for (var i = 0; i < result.length; i++) {
        result[i].changeInPercent = (result[i].changeInPercent * 100).toFixed(2)
      }
      return result
    },

    highlight : function(value) {
      if (value < 0) {
        return "red"
      }
      else if (value > 0) {
        return "green"
      }
    }
  })
}

if (Meteor.isServer) {

Meteor.methods({

  getStocks : function(test) {
    console.log(test);
    results = YahooFinance.snapshot({symbols:['AAPL','GOOGL','^VIX','SPY'], fields:['s','n','p2','b']})
    console.log(results);
    Stocks.remove({})
    for (var i = 0; i < results.length; i++) {
      Stocks.update({symbol : results[i].symbol}, results[i], {upsert : true})
    }
  }
})
}
