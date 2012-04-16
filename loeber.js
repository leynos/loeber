/*
 * Copyright © 2012, David McIntosh <dmcintosh@df12.net>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

(function (window) {

var convLines = 0;
var pause = false;
var stop = false;
var nextCallback;

function findNextLine(lines, index, time) {
    if (index >= lines.length) {
        return;
    }
    var parts = lines[index].split(' ');
    while (parts[0] != '') {
        if (parts[0] == 'starting') {
            $('#round-no').html(parts[2]);
        }
        index++;
        if (index >= lines.length) {
            return;
        }
        parts = lines[index].split(' ');
    }
    // window.alert(index);
    var nexttime = parts[1];
    if (time == 0) {
        wait = 0;
    } else {
        wait = (nexttime - time) / 40000.0;
    }
    var callback = function() { 
        routeLine(lines, index, nexttime);
    }
    if (stop) {
        stop = false;
        return;
    }
    if (pause) {
        nextCallback = callback;
    } else { 
        window.setTimeout(callback, wait );
    }
}

function routeLine(lines, index, time) {
    parts = lines[index].split(' ');
    convLines++;
    player = $('#'+parts[3]+'-'+parts[4]);
    chara = parts[5];
    if (chara == 'space') {
        chara = ' ';
    }
    if (chara == 'BackSpace') {
        player.contents().last().remove();
    } else {
        if (chara == 'CR') {
            elem = '<br />';
        } else {
            elem = '<span>'+chara+'</span>';
        }
        player.append(elem);
    }
    player.scrollTop(player[0].scrollHeight);
    findNextLine(lines, index+1, time);
}

function play(data) {
    $('.player').contents().remove();
    var lines = data.split('\n');
    findNextLine(lines, 0, 0);
}

$('#playpause').click(function() {
    if (pause) {
        $(this).attr('value', '❚❚');
        pause = false;
        nextCallback();
    } else {
        $(this).attr('value', '▸');
        pause = true;
    }
});

var logs = [
    {
        year: 2010,
        file: 'logfile.Wilcox.2010-10-23--10-02-39.log',
        name: 'Bruce Wilcox Program Transcript'
    }, {
        year: 2010,
        file: 'logfile.Wallace.2010-10-23--10-01-41.log',
        name: 'Richard Wallace Program Transcript'
    }, {
        year: 2010,
        file: 'logfile.Carpenter.2010-10-23--10-02-10.log',
        name: 'Rollo Carpenter Program Transcript'
    }, {
        year: 2010,
        file: 'logfile.Medeksza.2010-10-23--10-03-04.log',
        name: 'Robert Medeeksza Program Transcript'
    }
];

function loadFile(f) {
    function callback(d) {
        if (stop) {
            window.setTimeout(function() {callback(d);}, 10);
        }
        play(d);
    }
    $.ajax(f, {
        dataType: 'text',
        success: function(d) {callback(d);}
    });
}

$(window.document).ready(function() {
    var logSelect = $('#log-select');
    _.each(logs, function(log) {
        logSelect.append(
            '<option value="'+'chatlogs/' + log.year + '/' + log.file+'">'+
                log.name+' ('+log.year+')</option>'
        );
    });
    logSelect.change(function() {
        stop = true;
        loadFile(this.value);
    });
    log = logs[0];
    loadFile('chatlogs/' + log.year + '/' + log.file);
});



})(window);
