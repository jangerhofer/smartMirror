Stocks = new Mongo.Collection("stocks")

if (Meteor.isClient) {

  Template.stocks.onCreated(function() {
    this.state = new ReactiveDict;

    Stocks.find({}, {lastUpdated : 0}).observeChanges({
      changed: function(id, fields) {
      //  console.log(id);
      //  console.log(fields);
      }
    })

    tBoxes = $(".ticker")
    var boxIndex = 0
    for (var i = 1; i < tBoxes.length; i++) {
      TweenLite.to(tBoxes[i], 0, {
        top: "200px"
      })
    }
    TweenLite.delayedCall(2, nextBox)

    function nextBox() {
      TweenLite.to(tBoxes.eq(boxIndex), 1, {
        top: "200px"
      })

      if (boxIndex < tBoxes.length - 1) {
        boxIndex++
      } else {
        boxIndex = 0
      }
      TweenLite.fromTo(tBoxes.eq(boxIndex), 1, {
        top: "200px"
      }, {
        top: "0px"
      })

      TweenLite.delayedCall(2, nextBox)
    }


  })

  Template.stocks.helpers({
    getStocks: function(stockList) {
      result = Stocks.find({}, {sort : {changeInPercent : -1}}).fetch()
      for (var i = 0; i < result.length; i++) {
        result[i].changeInPercent = (result[i].changeInPercent * 100).toFixed(2)
      }
      return result
    },

    isPositive: function(changeInPercent) {
      if (changeInPercent > 0) {
        return true
      }
      return false
    },

    highlight: function(value) {
      if (value < 0) {
        return "red"
      } else if (value > 0) {
        return "green"
      }
    }
  })
}

if (Meteor.isServer) {

  Meteor.methods({

    pullStocks: function(test) {
      results = YahooFinance.snapshot({
        symbols: ['AAPL', 'CMG', 'GOOGL', '^VIX', 'SPY', 'TSLA', 'MNKD'],
        fields: ['s', 'n', 'p2', 'b']
      })
      for (var i = 0; i < results.length; i++) {
        results[i].lastUpdated = new Date()
        Stocks.update({
          symbol: results[i].symbol
        }, results[i], {
          upsert: true
        })
      }
    }
  })

  SyncedCron.add({
    name: 'Pull Stock Prices',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('every 1 seconds');
    },
    job: function() {
      Meteor.call("pullStocks", function(err, res) {})
    }
  })


}
