'use strict';

const config = {};

config.host = process.env.HOST;
config.authKey = process.env.AUTH_KEY;
config.databaseId = 'ToDoList';
config.collectionId = 'Items';

module.exports = config;