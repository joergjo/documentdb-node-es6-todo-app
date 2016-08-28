'use strict';

const Q = require('q');

class TaskList {
  constructor(taskDao) {
    this.taskDao = taskDao;
  }

  showTasks(req, res) {
    const querySpec = {
      query: 'SELECT * FROM root r WHERE r.completed=@completed',
      parameters: [{
        name: '@completed',
        value: false
      }]
    };

    this.taskDao.find(querySpec).done(items => {
      res.render('index', {
        title: 'My ToDo List',
        tasks: items.feed
      });
    }, err => {
      throw (err);
    });
  }

  addTask(req, res) {
    const item = req.body;

    this.taskDao.addItem(item).done(item => {
      res.redirect('/');
    }, err => {
      throw (err);
    });
  }

  completeTask(req, res) {
    const completedTasks = Object.keys(req.body);
    const updateCalls = [];

    completedTasks.forEach(taskId => {
      updateCalls.push(this.taskDao.updateItem(taskId));
    });

    Q.all(updateCalls).done(results => {
      res.redirect('/');
    }, err => {
      throw err;
    });
  }
}

module.exports = TaskList;
