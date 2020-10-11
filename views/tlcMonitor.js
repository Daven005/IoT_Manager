var tlc = 'none';
var socket;
var status = 'closed';

$(function () {
    $("#tlc").on('change', tlcChanged);
});

function tlcChanged() {
    tlc = this.value;
    if (tlc == 'none') return;
    if (status == 'closed') {
        open((data) => {
            console.log(data);
            socket = io.connect(`http://${location.host}:5001`);
            socket.on('connect', () => {
                setStatus('connected');
            });
            socket.on('disconnect', (reason) => {
                console.log(`Disconnected: ${error || reason}`);
                setStatus('closed');
            });
            socket.on("new_message", (data) => {
                $('input.viewer').append(data);
            });
        });
    }
}

function setStatus(s) {
    status = s;
    $('#status').text(s);
}
function open(cb) {
    var t = tlcConfig.find(t => t.Name == tlc);
    url = `/tlc/Monitor/open?tlc=${t.Name}`;
    $.getJSON(url, cb)
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Open Request Failed: " + err);
        });
}