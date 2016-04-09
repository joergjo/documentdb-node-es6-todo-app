'use strict';

const docdbUtils = require('./docdbUtils');

class TaskDao {
	constructor(documentDBClient, databaseId, collectionId) {
		this.client = documentDBClient;
		this.databaseId = databaseId;
		this.collectionId = collectionId;

		this.database = null;
		this.collection = null;
	}

	init(callback) {
		docdbUtils.getOrCreateDatabase(this.client, this.databaseId, (err, db) => {
			if (err) {
				callback(err);
			} else {
				this.database = db;
				docdbUtils.getOrCreateCollection(this.client, this.database._self, this.collectionId, (err, coll) => {
					if (err) {
						callback(err);
					} else {
						this.collection = coll;
					}
				});
			}
		});
	}

  find(querySpec, callback) {
		this.client.queryDocuments(this.collection._self, querySpec).toArray((err, results) => {
			if (err) {
				callback(err);
			} else {
				callback(null, results);
			}
		});
	}

	addItem(item, callback) {
		item.date = Date.now();
		item.completed = false;

		this.client.createDocument(this.collection._self, item, (err, doc) => {
			if (err) {
				callback(err);
			} else {
				callback(null, doc);
			}
		});
	}

	updateItem(itemId, callback) {
		this.getItem(itemId, (err, doc) => {
			if (err) {
				callback(err);
			} else {
				doc.completed = true;
				this.client.replaceDocument(doc._self, doc, (err, replaced) => {
					if (err) {
						callback(err);
					} else {
						callback(null, replaced);
					}
				});
			}
		});
	}
	
	getItem(itemId, callback) {
		let querySpec = {
			query: 'SELECT * FROM root r WHERE r.id=@id',
			parameters: [{
				name: '@id',
				value: itemId
			}]
		};

		this.client.queryDocuments(this.collection._self, querySpec).toArray((err, results) => {
			if (err) {
				callback(err);
			} else {
				callback(null, results[0]);
			}
		});
	}
}

module.exports = TaskDao;