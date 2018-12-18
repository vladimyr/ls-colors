'use strict';

const Category = require('./category');
const debug = require('debug')('parser');

// NOTE: Taken from BSD `ls` manpage:
//       https://www.freebsd.org/cgi/man.cgi?query=ls&sektion=1&format=html
const Style = {
  a: 'black',
  b: 'red',
  c: 'green',
  d: 'yellow',
  e: 'blue',
  f: 'magenta',
  g: 'cyan',
  h: 'white',
  x: 'default'
};

const Attribute = {
  0: Category.Directory,
  1: Category.Symlink,
  2: Category.Socket,
  3: Category.Pipe,
  4: Category.Executable,
  5: Category.BlockDevice,
  6: Category.CharDevice,
  7: Category.ExecutableSetuid,
  8: Category.ExecutableSetgid,
  9: Category.DirectoryWritableOthersSticky,
  10: Category.DirectoryWritableOthersNoSticky
};

const capitalize = str => str[0].toUpperCase() + str.substr(1);
const compact = arr => arr.filter(it => Boolean(it));
const isBold = code => /[A-H]/.test(code);
const join = (str1, str2) => str1 && str2 && (str1 + capitalize(str2));

module.exports = function parseBSD(colors) {
  const codes = pairs(colors);
  debug('color: %s', colors);
  debug('codes: %j', codes);
  return codes.reduce((acc, [fg, bg], index) => {
    const key = Attribute[index];
    const fgColor = getColor(fg);
    const bgColor = join('bg', getColor(bg));
    const modifiers = [fgColor, isBold(fg) && 'bold', bgColor];
    return Object.assign(acc, { [key]: compact(modifiers) });
  }, {});
};

function getColor(code) {
  const color = Style[code.toLowerCase()];
  if (color && color !== Style.x) return color;
}

function pairs(str) {
  const width = 2;
  const length = Math.floor(str.length / width);
  return Array.from({ length }).reduce((acc, _, index) => {
    acc.push(str.substr(index * width, width));
    return acc;
  }, []);
}
