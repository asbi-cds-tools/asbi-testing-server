const { initialize, loggers, constants } = require('@asymmetrik/node-fhir-server-core');
const { VERSIONS } = constants;
var bodyParser = require('body-parser');
var express = require('express');
var OAuthServer = require('express-oauth-server');
const Request = require('oauth2-server').Request;
const Response = require('oauth2-server').Response;
var memorystore = require('./src/oauth/memoryModel.js');
var cors = require('cors');

let config = {
  auth: {
    // This is so we know you want scope validation, without this, we would only
		// use the strategy
		type: 'smart',
		// Define our strategy here, for smart to work, we need the name to be bearer
		// and to point to a service that exports a Smart on FHIR compatible strategy
		strategy: {
			name: 'bearer',
			service: './src/services/authentication.service.js'
		}
  },
  server: {
    // Allow Access-Control-Allow-Origin
    port: 3000,
		corsOptions: {
			origin: 'http://localhost:8080'
		}
  },
  logging: {
		level: 'debug'
	},
  security: [
		{
			url: 'authorize',
			valueUri: `http://localhost:3001/oauth/authorize`
		},
		{
			url: 'token',
			valueUri: `http://localhost:3001/oauth/token`
		}
	],
  profiles: {
    Patient: {
      service: './src/services/patient.service.js',
      versions: [
        VERSIONS['4_0_0']
      ]
    },
    Condition: {
      service: './src/services/condition.service.js',
      versions: [
        VERSIONS['4_0_0']
      ]
    },
    Observation: {
      service: './src/services/observation.service.js',
      versions: [
        VERSIONS['4_0_0']
      ]
    },
    Procedure: {
      service: './src/services/procedure.service.js',
      versions: [
        VERSIONS['4_0_0']
      ]
    },
    QuestionnaireResponse: {
      service: './src/services/questionnaireresponse.service.js',
      versions: [
        VERSIONS['4_0_0']
      ]
    }
  }
};

// server is the FHIR server
let server = initialize(config);
let logger = loggers.get('default');

// app is the OAuth2 server
app = express();

// Allow Access-Control-Allow-Origin
app.use(cors({
  corsOptions: {
    origin: 'http://localhost:8080'
  }
}));

// OAuth2 server uses a simple in-memory cache.
app.oauth = new OAuthServer({
  model: new memorystore()
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint for authorizing in-coming requests.
app.get('/oauth/authorize', app.oauth.authorize({
  'authenticateHandler': {
    'handle': function(req,res){
      // The requested patient id is encoded in the launch parameter.
      // We need to pass this along to the OAuth server so it can return it in the token.
      this.app.oauth.server.options.model.patientId = req.query.launch;
      return app.oauth.server.options.model.users[0];
    }
  }
}));

// Returns access token after successful authorization. 
app.post('/oauth/token', app.oauth.token({
  'requireClientAuthentication': {authorization_code: false},
  'allowExtendedTokenAttributes': true
}));

// Authenticates via bearer token.
app.post('/oauth/authenticate', function(req,res,next) {
    if (req.body.token) {
      req.body.access_token = req.body.token;
    }
    next();
  },
  app.oauth.authenticate(), function(req,res,next){
    let tkn = res.locals.oauth.token;
    tkn.active = true;
    res.send(tkn);
  });

// server is the FHIR server
server.listen(3000, () => {
  logger.info('Starting the FHIR server at localhost:3000');
});

// app is the OAuth2 server
app.listen(3001, () => {
  logger.info('Starting the OAuth2 server at localhost:3001');
});