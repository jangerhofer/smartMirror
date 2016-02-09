var icons = {
  'clear-day': 'day-sunny',
  'clear-night': 'night-clear',
  'rain': 'rain',
  'snow': 'snow',
  'sleet': 'sleet',
  'wind': 'strong-wind',
  'fog': 'fog',
  'cloudy': 'cloudy',
  'partly-cloudy-day': 'day-cloudy',
  'partly-cloudy-night': 'night-partly-cloudy',
  'hail': 'hail',
  'thunderstorm': 'thunderstorm',
  'tornado': 'tornado'
};

Locations = new Mongo.Collection("locations")
Weather = new Mongo.Collection("weather")

if (Meteor.isClient) {

  Template.weather.helpers({
      findLocations : function() {
        return Locations.find().fetch();
      },
      curTemp: function(cityName) {
        return Weather.findOne({locationName : cityName}).currently.temperature;
      },
      icon: function(cityName) {
        return icons[Weather.findOne({locationName : cityName}).currently.icon];
      }
    });

}

if (Meteor.isServer) {

  Meteor.methods({

    updateWeather: function() {
      var ForecastIo = require('forecastio');
      var forecastIo = new ForecastIo('d31eb07bdbc10ef4753c477675d626b7');

      weatherLocs = Locations.find({}).fetch()
      console.log("WLocs: " + weatherLocs[0].locationName);

      for (var i = 0; i < weatherLocs.length; i++) {
        curLoc = weatherLocs[i].locationName
        forecastIo.forecast(weatherLocs[i].lat, weatherLocs[i].long).then(Meteor.bindEnvironment(function(data) {
          Weather.remove({
            'locationName': curLoc
          })
          data.locationName = curLoc
          Weather.insert(data)
        }))
      }

    }
  })

  SyncedCron.add({
    name: 'Update Weather Feeds',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('every 6 minutes');
    },
    job: function() {
      Meteor.call("updateWeather")
    }
  });

  SyncedCron.start();
}
