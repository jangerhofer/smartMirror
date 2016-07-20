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

Weather = new Mongo.Collection("weather")

if (Meteor.isClient) {

  Template.weather.helpers({
    findLocations: function() {
      return Weather.find({}, {
        sort: {
          locationName: 1
        }
      }).fetch();
    },
    curTemp: function(cityName) {
      return Weather.findOne({
        locationName: cityName
      }).currently.temperature;
    },
    icon: function(cityName) {
      return icons[Weather.findOne({
        locationName: cityName
      }).currently.icon];
    }
  });

}

if (Meteor.isServer) {

  Meteor.methods({

    pullWeather: function() {
      var ForecastIo = require('forecastio');
      var forecastIo = new ForecastIo('d31eb07bdbc10ef4753c477675d626b7')

      locations = Weather.find().fetch();

      for (var i = 0; i < locations.length; i++) {
        var locationName = locations[i].locationName

        var getWeather = Meteor.wrapAsync(forecastIo.forecast, forecastIo)
        var data = getWeather(locations[i].latitude, locations[i].longitude, {})
        Weather.update({
          locationName: locationName
        }, {
          $set: data
        })
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
      Meteor.call("pullWeather")
    }
  });

  SyncedCron.start();
}
