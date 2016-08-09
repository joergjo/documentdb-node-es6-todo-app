'use strict';

const async = require('async');

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

    this.taskDao.find(querySpec, (err, items) => {
      if (err) {
        throw (err);
      }

      res.render('index', {
        title: 'My ToDo List',
        tasks: items
      });
    });
  }

  addTask(req, res) {
    const item = req.body;

    this.taskDao.addItem(item, (err) => {
      if (err) {
        throw (err);
      }

      res.redirect('/');
    });
  }

  completeTask(req, res) {
    const completedTasks = Object.keys(req.body);

    async.forEach(completedTasks, (completedTask, callback) => {
      this.taskDao.updateItem(completedTask, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }, (err) => {
      if (err) {
        throw err;
      }

      res.redirect('/');
    });
  }
}

module.exports = TaskList;
