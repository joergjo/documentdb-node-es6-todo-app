'use strict';

class DocDBUtils {

	static getOrCreateDatabase(client, databaseId) {
		const querySpec = {
			query: 'SELECT * FROM root r WHERE r.id=@id',
			parameters: [{
				name: '@id',
				value: databaseId
			}]
		};

		return client.queryDatabases(querySpec).toArrayAsync().then(results => {
			if (results.length === 0) {
				const databaseSpec = {
					id: databaseId
				};

				client.createDatabaseAsync(databaseSpec)
					.then(databaseResponse => {
						const database = databaseResponse.resource;
						return database;
					});
			}
			return results.feed[0];
		}).fail(error => {
			console.log(`Error creating database ${databaseId}: ${error}`);
			throw error;
		});
	}

	static getOrCreateCollection(client, databaseLink, collectionId) {
		const querySpec = {
			query: 'SELECT * FROM root r WHERE r.id=@id',
			parameters: [{
				name: '@id',
				value: collectionId
			}]
		};

		return client.queryCollections(databaseLink, querySpec).toArrayAsync().then(results => {
			if (results.length === 0) {
				const collectionSpec = {
					id: collectionId
				};

				const requestOptions = {
					offerType: 'S1'
				};

				client.createCollectionAsync(databaseLink, collectionSpec, requestOptions).then(collectionResponse => {
					const collection = collectionResponse.resource;
					return collection;
				});
			} else {
				return results.feed[0];
			}
		}).fail(error => {
			console.log(`Error creating collection ${collectionId}: ${error}`);
			throw error;
		});
	}
}

module.exports = DocDBUtils;