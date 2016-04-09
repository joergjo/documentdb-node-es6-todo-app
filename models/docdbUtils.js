'use strict';

class DocDBUtils {
	static getOrCreateDatabase(client, databaseId, callback) { 
		let querySpec = {
			query: 'SELECT * from root r WHERE r.id=@id',
			parameters: [{
				name: '@id',
				value: databaseId
			}]
		};

		client.queryDatabases(querySpec).toArray((err, results) => {
			if (err) {
				callback(err);
			} else {
				if (results.length === 0) {
					let databaseSpec = {
						id: databaseId
					};

					client.createDatabase(databaseSpec, (err, created) => {
						callback(null, created);
					});
				} else {
					callback(null, results[0]);
				}
			}
		});
	}

	static getOrCreateCollection(client, databaseLink, collectionId, callback) { 
			let querySpec = {
			query: 'SELECT * from root r WHERE r.id=@id',
			parameters: [{
				name: '@id',
				value: collectionId
			}]
		};

		client.queryCollections(databaseLink, querySpec).toArray((err, results) => {
			if (err) {
				callback(err);
			} else {
				if (results.length === 0) {
					let collectionSpec = {
						id: collectionId
					};

					let requestOptions = {
						offerType: 'S1'
					};

					client.createCollection(databaseLink, collectionSpec, requestOptions, (err, created) => {
						callback(null, created);
					});
				} else {
					callback(null, results[0]);
				}
			}
		});
	}
}

module.exports = DocDBUtils;