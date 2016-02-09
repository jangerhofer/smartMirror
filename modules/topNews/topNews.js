if (Meteor.isServer) {
  SyncedCron.add({
  name: 'Pull New Top News',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 5 minutes');
  },
  job: function() {
    Meteor.call("pullTopStories", function(err, res) {
      console.log("Error! " + err)
      Session.set('topStories', res)
    })
  }
});
}
