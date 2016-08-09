'use strict';

require('dotenv').load();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const DocumentDBClient = require('documentdb').DocumentClient;
const config = require('./config');
const TaskList = require('./routes/tasklist');
const TaskDao = require('./models/taskDao');
const appInsights = require('applicationinsights');

appInsights.setup().start();
console.log('Application Insights active.');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const docDBClient = new DocumentDBClient(config.host, {
  masterKey: config.authKey
});

const taskDao = new TaskDao(docDBClient, config.databaseId, config.collectionId);
taskDao.init((err) => {
  console.log(err);
  appInsights.client.trackException(err);
});

const taskList = new TaskList(taskDao);

app.get('/', (req, res) => taskList.showTasks(req, res));
app.post('/addtask', (req, res) => taskList.addTask(req, res));
app.post('/completetask', (req, res) => taskList.completeTask(req, res));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  if (appInsights) {
    appInsights.client.trackException(err);
  }
  res.render('error', {
    message: err.message,
    error: {}
  });
});

appInsights.client.trackEvent('Server started');

module.exports = app;
