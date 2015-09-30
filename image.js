/**
 * Created by shuding on 9/28/15.
 * <ds303077135@gmail.com>
 */

'use strict';

var path   = require('path');
var Canvas = require('canvas');

var font = new Canvas.Font('SourceHanSans', path.join(__dirname, 'static', 'SourceHanSansCN-Normal.otf'));
font.addFace(path.join(__dirname, 'static', 'SourceHanSansCN-Normal.otf'), 'normal');

var FIXED_OPTIONS = {
    'font-family': '"SourceHanSans"'
};

var DEFAULT_OPTIONS = {
    'courses':                 [],
    'lines':                   [],
    'custom-line-color':       'red',
    'day-content':             ['一', '二', '三', '四', '五'],
    'width':                   320,
    'height':                  640,
    'line-color':              '#ccc',
    'text-color':              '#000',
    'font-size':               12,
    'info-text-color':         '#555',
    'info-font-size':          10,
    'background-color':        '#f5f5f5',
    'header-height':           40,
    'header-line-color':       '#000',
    'header-text-color':       '#000',
    'header-font-size':        15,
    'sidebar-width':           30,
    'sidebar-line-color':      '#000',
    'sidebar-text-color':      '#000',
    'sidebar-font-size':       12,
    'days':                    5,
    'sections':                14,
    'course-background-color': '#fff'
};

function handleOptions(opts) {
    var options = {};
    var key;
    for (key in DEFAULT_OPTIONS) {
        if (DEFAULT_OPTIONS.hasOwnProperty(key)) {
            if (typeof opts[key] !== 'undefined') {
                options[key] = opts[key];
            } else {
                options[key] = DEFAULT_OPTIONS[key];
            }
        }
    }
    for (key in FIXED_OPTIONS) {
        if (FIXED_OPTIONS.hasOwnProperty(key)) {
            options[key] = FIXED_OPTIONS[key];
        }
    }
    return options;
}

function render(data, res) {
    var i;
    var j;
    var st;
    var ed;

    var options = handleOptions(data);

    var canvas = new Canvas(options.width, options.height);
    var ctx    = canvas.getContext('2d');
    ctx.addFont(font);

    // Background
    ctx.fillStyle = options['background-color'];
    ctx.fillRect(0, 0, options.width, options.height);

    // Rows
    var rowWidth    = (options.width - options['sidebar-width']) / (options.days || 1);
    ctx.strokeStyle = options['line-color'];
    ctx.beginPath();
    for (i = 1; i < options.days; ++i) {
        ctx.moveTo(options['sidebar-width'] + rowWidth * i, 0);
        ctx.lineTo(options['sidebar-width'] + rowWidth * i, options.height);
    }
    ctx.stroke();

    // Days
    ctx.fillStyle = options['header-text-color'];
    ctx.textAlign = 'center';
    ctx.font      = options['header-font-size'] + 'px ' + options['font-family'];
    for (i = 0; i < options['day-content'].length; ++i) {
        ctx.fillText(options['day-content'][i], options['sidebar-width'] + rowWidth * (i + 0.5), options['header-height'] - 15);
    }

    // Lines
    var lineHeights    = [0];
    var lineHeightSums = [0];

    for (i = 0; i < options.courses.length; ++i) {
        if (options.courses[i].section) {
            if (options.courses[i].section.indexOf('-') !== -1) {
                st = options.courses[i].section.split('-');
                ed = Number(st[1]);
                st = Number(st[0]);
            } else {
                st = ed = Number(options.courses[i].section);
            }
            options.courses[i].st = st;
            options.courses[i].ed = ed;
            for (j = st; j <= ed; ++j) {
                lineHeights[j] = 1;
            }
        }
    }

    for (i = 1; i <= options.sections; ++i) {
        lineHeightSums[i] = (lineHeights[i] || 0) + lineHeightSums[i - 1];
    }

    var halfLineHeight = (options.height - options['header-height']) / ((lineHeightSums[options.sections] + options.sections) || 1);

    ctx.strokeStyle = options['line-color'];
    ctx.beginPath();
    for (i = 1; i <= options.sections; ++i) {
        ctx.moveTo(0, options['header-height'] + halfLineHeight * (i + lineHeightSums[i]));
        ctx.lineTo(options.width, options['header-height'] + halfLineHeight * (i + lineHeightSums[i]));
    }
    ctx.stroke();

    ctx.textAlign = 'center';
    for (i = 0; i < options.courses.length; ++i) {
        if (options.courses[i].section) {
            st            = options.courses[i].st - 1;
            ed            = options.courses[i].ed - 1;
            ctx.font      = options['font-size'] + 'px ' + options['font-family'];
            ctx.fillStyle = options.courses[i]['background-color'] || options['course-background-color'];
            ctx.fillRect(options['sidebar-width'] + options.courses[i].day * rowWidth + 1, options['header-height'] + halfLineHeight * (st + lineHeightSums[st]) + 1, rowWidth - 2, (ed - st + 1) * halfLineHeight * 2 - 2);

            var testLine;
            var metrics;
            var testWidth;
            var line      = '';
            var name      = options.courses[i].name;
            var x         = options['sidebar-width'] + options.courses[i].day * rowWidth + rowWidth * 0.5;
            var y         = options['header-height'] + halfLineHeight * (st + lineHeightSums[st]) + halfLineHeight;
            ctx.fillStyle = options.courses[i]['text-color'] || options['text-color'];

            for (j = 0; j < name.length; j++) {
                if (name[j] !== '\n') {
                    testLine = line + name[j];
                }
                metrics   = ctx.measureText(testLine);
                testWidth = metrics.width;
                if (testWidth > (rowWidth - 4) && j > 0 || name[j] === '\n') {
                    ctx.fillText(line, x, y);
                    if (name[j] !== '\n') {
                        line = name[j];
                    } else {
                        line = '';
                    }
                    y += Number(options['font-size']) * 1.6;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, x, y);
            y += Number(options['font-size']) * 1.6;

            if (options.courses[i].info && options.courses[i].info.length) {
                line          = '';
                name          = options.courses[i].info;
                x             = options['sidebar-width'] + options.courses[i].day * rowWidth + rowWidth * 0.5;
                ctx.font      = options['info-font-size'] + 'px ' + options['font-family'];
                ctx.fillStyle = options['info-text-color'];

                for (j = 0; j < name.length; j++) {
                    if (name[j] !== '\n') {
                        testLine = line + name[j];
                    }
                    metrics   = ctx.measureText(testLine);
                    testWidth = metrics.width;
                    if (testWidth > (rowWidth - 10) && j > 0 || name[j] === '\n') {
                        ctx.fillText(line, x, y);
                        if (name[j] !== '\n') {
                            line = name[j];
                        } else {
                            line = '';
                        }
                        y += Number(options['info-font-size']) * 1.6;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, x, y);
            }
        }
    }

    // Custom lines
    ctx.strokeStyle = options['custom-line-color'];
    ctx.beginPath();
    for (i = 0; i < options.lines.length; ++i) {
        ctx.moveTo(0, options['header-height'] + halfLineHeight * (options.lines[i] + lineHeightSums[options.lines[i]]));
        ctx.lineTo(options.width, options['header-height'] + halfLineHeight * (options.lines[i] + lineHeightSums[options.lines[i]]));
    }
    ctx.stroke();

    // Section numbers
    ctx.fillStyle = options['sidebar-text-color'];
    ctx.font      = options['sidebar-font-size'] + 'px ' + options['font-family'];
    for (i = 1; i <= options.sections; ++i) {
        ctx.fillText(String(i), options['sidebar-width'] * 0.5, halfLineHeight * (i + lineHeightSums[i] + 1.25 - (lineHeights[i] || 0) * 0.5));
    }

    // Header
    ctx.strokeStyle = options['header-line-color'];
    ctx.beginPath();
    ctx.lineTo(0, options['header-height']);
    ctx.lineTo(options.width, options['header-height']);
    ctx.stroke();

    // Sidebar
    ctx.strokeStyle = options['sidebar-line-color'];
    ctx.beginPath();
    ctx.lineTo(options['sidebar-width'], 0);
    ctx.lineTo(options['sidebar-width'], options.height);
    ctx.stroke();

    var stream = canvas.pngStream();

    return res ? stream.pipe(res) : canvas.toDataURL();
}

function createJpeg(raw, res) {
    var data;
    try {
        data = JSON.parse(raw);
    } catch (err) {
        return 'ERROR: invalid request, please check the syntax.';
    }
    return render(data, res);
}

module.exports.base64 = function (options, next) {
    return next(createJpeg(options));
};

module.exports.stream = function (options, res) {
    return createJpeg(options, res);
};
