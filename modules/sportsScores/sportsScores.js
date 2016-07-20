dateString = moment(new Date()).format('YYYY-MM-DD')
NHLGames = new Mongo.Collection("nhlGames")

if (Meteor.isClient) {
  Template.sportsScores.helpers({



  })
}

if (Meteor.isServer) {
  Meteor.methods({

    pullNHLGamesToday: function() {
      HTTP.get('http://statsapi.web.nhl.com/api/v1/schedule?startDate=' + dateString + '&endDate=' + dateString, {}, function(err, res) {
        games = res.data.dates[0].games
        for (var i = 0; i < games.length; i++) {
          game = games[i]
          NHLGames.update({
            gameID: game.gamePk
          }, game, {
            upsert: true
          })
        }
      });
    }
  })
}
