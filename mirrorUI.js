if (Meteor.isClient) {
  Meteor.call("pullTopStories", function(err, res) {
    console.log("Error! " + err)
    Session.set('topStories', res)
  })

  Template.topStories.helpers({
    topStories: function () {
      return Session.get("topStories")
    },

    displayDate: function (dateIn) {
      dateOut = dateIn.substring(0, 19)
      return(moment(dateOut).fromNow())
    }
  });

}

if (Meteor.isServer) {
  var ForecastIo = require('forecastio');
  var forecastIo = new ForecastIo('d31eb07bdbc10ef4753c477675d626b7');
  nytKey = "49d2aa1c3dd68c1d4d7ac1840c4fe612:5:74315458"

  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    pullTopStories : function() {
      var result = HTTP.call("GET", "http://api.nytimes.com/svc/topstories/v1/home.json",{params : {"api-key" : nytKey}})
      headlines = JSON.parse(result.content).results
      return headlines
    },

    pullCalendar : function() {
      var result = HTTP.call("GET", "https://p06-calendarws.icloud.com/ca/subscribe/1/TedabBvAaxx6oeKWyUpnmWWHleEp168yK43ZzUa-y7RQGjeHO7Me8YoHCc6EqLQA", {})

      console.log(result);
    }

  })
}
