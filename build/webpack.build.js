const path = require("path");
const base = require('./webpack.config');
const baseMini = require('./webpack.config.mini');

module.exports = [base,baseMini];