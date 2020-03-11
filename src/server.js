#!/usr/bin/env node

const struct = require('./parser.js');
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'build')));
app.get('/ping', (req, res) => res.send('pong'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));
app.get('/struct', (req, res) => res.send(struct));
console.log('server is running');
console.log(struct);
app.listen( port, () => console.log(`Listening on ${port}`));
