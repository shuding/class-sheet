# class-sheet

[![npm version](https://badge.fury.io/js/class-sheet.svg)](http://badge.fury.io/js/class-sheet)
[![Build Status](https://api.travis-ci.org/quietshu/class-sheet.svg?branch=master)](https://travis-ci.org/quietshu/class-sheet)
[![XO: Linted](https://img.shields.io/badge/xo-linted-blue.svg)](https://github.com/sindresorhus/xo)

__Under construction.__

A package that generates image from class-sheet data.

## Quick start

- `$ sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++`
- `$ npm i class-sheet -S`

## Example

As a server with express.js:

```javascript
var classSheet = require('class-sheet');

router.get('/:course_data', function (req, res, next) {
    // stream and pipe to res, send image/png result as the response
    classSheet.imageStream(req.params.course_data, res);
});
```

As an independent tool:

```javascript
var classSheet = require('class-sheet');

// output the base64 result
console.log(classSheet.image(course_data));
```

## Data format

A JSON string, i.e.:

```javascript
course_data = '{\
  "courses":\
    [\
      {"name":"人工智能","day":0,"section":"2-4"},\
      {"name":"数据通信与计算机网络","day":2,"section":"11-12"},\
      {"name":"数据通信与计算机网络","day":0,"section":"6-8"},\
      {"name":"操作系统","day":1,"section":"8-9"},\
      {"name":"游戏开发基础","day":2,"section":"2-4"},\
      {"name":"概率论与数理统计","day":2,"section":"6-8"},\
      {"name":"第一哲学沉思集","day":3,"section":"11-12"},\
      {"name":"中文信息处理","day":3,"section":"3-4"},\
      {"name":"计算机图形学","day":4,"section":"2-4"},\
      {"name":"操作系统","day":3,"section":"6-8"},\
      {"name":"概率论与数理统计","day":4,"section":"6-7"}\
    ]\
}'
```

Then calling `classSheet.image` with `course_data` will get the image below (as base64 data):

![1.png](https://github.com/quietshu/class-sheet/raw/master/example/1.png)

Notice you can get the JSON string by calling `JSON.stringify(course_object_data)`.

Another example:

![2.png](https://github.com/quietshu/class-sheet/raw/master/example/2.png)

## Usage

### Install

From NPM:
- `$ npm install class-sheet`

From git repo:

- install node-canvas: https://github.com/Automattic/node-canvas/wiki
- `$ git clone git@github.com:quietshu/class-sheet.git`
- `$ npm install`

### Test

Code style:

`$ npm test` (current only `xo.js`)

### Options

- `courses`
  - courses data
  - default: `[]`
  - example: `[{"name":"Modern Art","day":2,"section":"1-3"}, {"name":"Computer Graphics","day":"4","section":"9-10","text-color":"red"}]`
- `lines`
  - horizontal lines
  - default: `[]`
  - example: `[5, 10]` will drop lines under section 5 and section 10
- `custom-line-color`
  - default: `'red'`
- `day-content`
  - default: `['一', '二', '三', '四', '五']`
- `width`
  - default: `320`
- `height`
  - default: `640`
- `line-color`
  - default: `'#ccc'`
- `text-color`
  - default: `'#000'`
- `font-size`
  - default: `12`
- `info-text-color`
  - default: `'#555'`
- `info-font-size`
  - default: `10`
- `background-color`
  - default: `'#f5f5f5'`
- `header-height`
  - default: `40`
- `header-line-color`
  - default: `'#000'`
- `header-text-color`
  - default: `'#000'`
- `header-font-size`
  - default: `15`
- `sidebar-width`
  - default: `30`
- `sidebar-line-color`
  - default: `'#000'`
- `sidebar-text-color`
  - default: `'#000'`
- `sidebar-font-size`
  - default: `12`
- `days`
  - default: `5`
- `sections`
  - default: `14`
- `course-background-color`
  - default: `'#fff'`

## Acknowledgements

- node-canvas

## License

MIT.

<3
