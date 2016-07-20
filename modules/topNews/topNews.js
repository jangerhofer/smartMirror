TopStories = new Meteor.Collection("topStories")

if (Meteor.isClient) {
  Meteor.call("pullTopStories")

  Template.topStories.helpers({
    topStories: function () {
      return TopStories.find({}, {limit : 6, sort : {updated_date : - 1}}).fetch()
    },

    displayDate: function (dateIn) {
      dateOut = dateIn.substring(0, 19)
      return(moment(dateOut).fromNow())
    }
  });

}

if (Meteor.isServer) {
  SyncedCron.add({
  name: 'Pull New Top News',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 5 minutes');
  },
  job: function() {
    Meteor.call("pullTopStories", function(err, res) {
    })
  }
});

Meteor.methods({
  pullTopStories : function() {
    var result = HTTP.call("GET", "http://api.nytimes.com/svc/topstories/v1/home.json",{params : {"api-key" : nytKey}})
    headlines = JSON.parse(result.content).results
    for (var i = 0; i < headlines.length; i++) {
      TopStories.update({url : headlines[i].url}, headlines[i], {upsert : true})
    }

  }
})
}
