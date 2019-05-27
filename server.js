const path = require('path');
const express = require('express');
const Gun = require('gun');

const app = express();
const port = (process.env.PORT || 8080);


  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.config.js');
  const compiler = webpack(config);

  app.use(webpackHotMiddleware(compiler));
  app.use(webpackDevMiddleware(compiler));

app.use(Gun.serve);
const server = app.listen(port);

Gun({web: server, peers: {'https://sample-chat-app-react-gundb.herokuapp.com/gun':{}} });
