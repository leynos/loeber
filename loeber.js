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
var nextCallback;

function findNextLine(lines, index, time) {
    if (index >= lines.length) {
        return;
    }
    var parts = lines[index].split(' ');
    while (parts[0] != '') {
        // window.alert('l '+index+' '+parts[0]);
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

$.ajax('logfile.Wilcox.2010-10-23--10-02-39.log', {
    dataType: 'text',
    success: function(d) {
        play(d);
    },
});

})(window);
