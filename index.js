'use strict';

const parseBSD = require('./bsd');
const parseGNU = require('./gnu');

const isGNU = colors => colors.includes('=');

module.exports = function (ls_colors) {
  ls_colors = ls_colors || process.env.LS_COLORS || process.env.LSCOLORS;
  return isGNU(ls_colors) ? parseGNU(ls_colors) : parseBSD(ls_colors);
};

module.exports.parseBSD = parseBSD;
module.exports.parseGNU = parseGNU;
module.exports.Category = require('./category');
