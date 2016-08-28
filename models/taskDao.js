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

	init() {
		return docdbUtils.getOrCreateDatabase(this.client, this.databaseId).then(db => {
			this.database = db;
			return docdbUtils.getOrCreateCollection(this.client, this.database._self, this.collectionId).then(coll => this.collection = coll);
		});
	}

  find(querySpec) {
		return this.client.queryDocuments(this.collection._self, querySpec).toArrayAsync();
	}

	addItem(item) {
		item.date = Date.now();
		item.completed = false;
		return this.client.createDocumentAsync(this.collection._self, item);
	}

	updateItem(itemId) {
		return this.getItem(itemId).then(items => {
			const item = items.feed[0];
			item.completed = true;
			return this.client.upsertDocumentAsync(this.collection._self, item);
		});
	}

	getItem(itemId) {
		const querySpec = {
			query: 'SELECT * FROM root r WHERE r.id=@id',
			parameters: [{
				name: '@id',
				value: itemId
			}]
		};

		return this.find(querySpec);
	}
}

module.exports = TaskDao;