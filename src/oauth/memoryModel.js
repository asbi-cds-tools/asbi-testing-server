// Based on https://github.com/oauthjs/express-oauth-server/blob/master/examples/memory/model.js
// from the oauthjs/express-oauth-server project.
// Available under an MIT License.
// (C) 2015 Seegno

/**
 * Constructor.
 */
function InMemoryCache() {
  this.patientId = null;
  this.clients = [{ 
    id : 'dummy-client-id',
    clientSecret : 'dummy-client-secret',
    redirectUris : 'http://localhost:8080/',
    grants: ['authorization_code'],
  }];
  this.tokens = [];
  this.users = [{ id : '123', username: 'user', password: 'pass' }];
  this.authorization_code = {
    'dummy-authorization-code': {
      authorizationCode: 'dummy-authorization-code',
      expiresAt: new Date('January 1, 2030 01:01:00'),
      scope: 'patient/*.read patient/*.write',
      client: {
        'id': this.clients[0].id
      },
      user: this.users[0]
    }
  }
}

/*
 * Get access token.
 */
InMemoryCache.prototype.getAccessToken = function(bearerToken) {
  var tokens = this.tokens.filter(function(tkn) {
    return tkn.accessToken === bearerToken;
  });
  return tokens.length ? tokens[0] : false;
};

/*
 * Get authorization code.
 */
InMemoryCache.prototype.getAuthorizationCode = function(authorizationCode){
  return this.authorization_code[authorizationCode];
}

/**
 * Get client.
 */
InMemoryCache.prototype.getClient = function(clientId, clientSecret) {
  var clients = this.clients.filter(function(client) {
    // For simplicity we assume that the client secret is passed in via the user 
    // agent, which we have not implemented.
    return client.id === clientId;
    // return client.clientId === clientId &&
    //        client.clientSecret === clientSecret;
  });
  return clients.length ? clients[0] : false;
};

/**
 * Save token.
 */
InMemoryCache.prototype.saveToken = function(token, client, user) {
  let id_token_string = '{"profile":"Practitioner/' + `${user.id}"}`;
  var newToken = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    scope: token.scope,
    client: client,
    user: user,
    patient: this.patientId,
    encounter: '456',
    id_token: Buffer.from('id_token dummy header').toString('base64') + '.' + Buffer.from(id_token_string).toString('base64')
  };
  this.tokens.push(newToken);
  return newToken;
};

/**
 * Save authorization code.
 */
InMemoryCache.prototype.saveAuthorizationCode = function(code, client, user){
  let authCode = {
    authorizationCode: code.authorizationCode,
    expiresAt: new Date('January 1, 2030 01:01:00'),
    scope: code.scope,
    client: {
      'id': client.id
    },
    user: {
      'id': user.id
    }
  };
  this.authorization_code[code.authorizationCode] = authCode;
  return authCode;
}

/**
 * Revoke authorization code.
 */
InMemoryCache.prototype.revokeAuthorizationCode = function(code){
  return true;
}

/**
 * Verify scope.
 */
InMemoryCache.prototype.verifyScope = function(token, scope){
  return true;
}

/**
 * Export constructor.
 */
module.exports = InMemoryCache;