'use strict';

const docdbUtils = require('./docdbUtils');

class TaskDao {
	constructor(documentDBClient, databaseId, collectionId, appInsightsClient) {
		this.client = documentDBClient;
		this.databaseId = databaseId;
		this.collectionId = collectionId;
		this.appInsightsClient = appInsightsClient;

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

	addItem(task) {
		task.date = Date.now();
		task.completed = false;
		this.trackTask('Adding', task);
		return this.client.createDocumentAsync(this.collection._self, task);
	}

	updateItem(taskId) {
		return this.getItem(taskId).then(items => {
			const item = items.feed[0];
			item.completed = true;
			this.trackTask('Completing', item);
			return this.client.upsertDocumentAsync(this.collection._self, item);
		});
	}

	getItem(taskId) {
		const querySpec = {
			query: 'SELECT * FROM root r WHERE r.id=@id',
			parameters: [{
				name: '@id',
				value: taskId
			}]
		};

		return this.find(querySpec);
	}

	trackTask(action, task) {
		const message = `${action} task ${task.name}.`;
		this.appInsightsClient.trackEvent(message);
	}
}

module.exports = TaskDao;