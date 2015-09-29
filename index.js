/**
 * Created by shuding on 9/28/15.
 * <ds303077135@gmail.com>
 */

'use strict';

var cli   = require('./cli');
var image = require('./image');

module.exports.cli         = cli;
module.exports.image       = image.base64;
module.exports.imageStream = image.stream;
