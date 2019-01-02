var request = require('request');
var rp = require('request-promise');

// Probably not the best way to share vars between functions in module scope. Please let me know the right way.
var globalIdClient = '';
var globalPasskey = '';

// API variables
var getIncomingBusesToStopUrl = 'https://openbus.emtmadrid.es/emt-proxy-server/last/geo/GetArriveStop.php';

module.exports = {
	initAPICredentials : function (idClient, passKey ){
		globalIdClient = idClient;
		globalPasskey = passKey;
	},
	getIncomingBusesToStop : function (idStop, callback ){

		// Response JSON, to be populated later
		var response = {
		};


		// Entry parameters
		var formData = {
			"cultureInfo": "ES",
			"idStop": idStop,
			"idClient": globalIdClient,
			"passKey": globalPasskey
		};

		var options = {
		    method: 'POST',
		    uri: getIncomingBusesToStopUrl,
		    form: formData,
		    json: true, // Automatically stringifies the body to JSON
		    strictSSL: false // The API certificate looks self signed
		};

		rp(options)
	    .then(function (parsedBody) {
	        console.log('REST call OK');
			response.status = 200;
			response.arrives = parsedBody.arrives;

			if (typeof callback === "function") {
				callback ( response );
			}
	    })
	    .catch(function (err) {
	        console.error('Error while connecting:');
			response.status = 400;
			response.error = err;

			if (typeof callback === "function") {
				callback ( response );
			}
	    });
	}
}
