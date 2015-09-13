var config = {};

config.host = process.env.HOST || 'https://joergjo-westeurope.documents.azure.com:443/';
config.authKey = process.env.AUTH_KEY || 'qynzmp/u3isJbELeYqJJ5dphqc2QH4B6JTYNBdGBFckJwofW56HvzdTmCNphzwvP9w4cKr7ppbpqV8Me/4T+ww==';
config.databaseId = 'ToDoList';
config.collectionId = 'Items';

module.exports = config;