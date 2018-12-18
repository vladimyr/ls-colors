'use strict';

const Category = require('./category');
const debug = require('debug')('parser');

// NOTE: Taken from ggreer/lscolors: https://git.io/fphfG &
//       GNU `dir_colors` manpage: http://man7.org/linux/man-pages/man5/dir_colors.5.html
const Style = {
  0: 'default',
  1: 'bold',
  4: 'underline',
  7: 'invert',
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'purple',
  36: 'cyan',
  37: 'gray',
  40: 'bgBlack',
  41: 'bgRed',
  42: 'bgGreen',
  43: 'bgYellow',
  44: 'bgBlue',
  45: 'bgPurple',
  46: 'bgCyan',
  47: 'bgGray'
};

const Attribute = {
  di: Category.Directory,
  ln: Category.Symlink,
  so: Category.Socket,
  pi: Category.Pipe,
  ex: Category.Executable,
  bd: Category.BlockDevice,
  cd: Category.CharDevice,
  su: Category.ExecutableSetuid,
  sg: Category.ExecutableSetgid,
  tw: Category.DirectoryWritableOthersSticky,
  ow: Category.DirectoryWritableOthersNoSticky
};

const compact = arr => arr.filter(it => Boolean(it));

module.exports = function parseGNU(colors) {
  const codes = compact(colors.split(':'));
  debug('colors: %s', colors);
  debug('codes: %j', codes);
  return codes.reduce((acc, styles) => {
    const [attr, codes] = styles.split('=');
    const modifiers = codes.split(';').map(code => getStyle(code));
    const key = Attribute[attr] || attr;
    if (key) acc[key] = compact(modifiers);
    return acc;
  }, {});
};

function getStyle(code) {
  code = parseInt(code, 10);
  const style = Style[code];
  if (style && style !== Style[0]) return style;
}
