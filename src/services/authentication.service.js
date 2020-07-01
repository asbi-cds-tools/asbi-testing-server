const smartBearerStrategy = require('@asymmetrik/sof-strategy');

module.exports.strategy = smartBearerStrategy({
	introspectionUrl: 'http://localhost:3001/oauth/authenticate',
	clientSecret: 'dummy-client-secret',
	clientId: 'dummy-client-id'
});