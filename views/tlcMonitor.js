var tlc = 'none';
var socket;
var status = 'closed';
var newTLc = 'none';
var cmdList = [];
var cmdIndex = -1;

/* Socket message types:
    transmitted
        tlc - make connection to TLc
        cmd - command for TLc
        close - finished with TLc

    received
        info - message from IoT Manager
        text - data from TLc (first indicates channel is open)
        closed - IoT Manager confirms connection to TLc is closed

    Socket messages
        connected - link to IoT Mamager established
        disconnected - link to IoT Mamager broken
*/

$(function () {
    $("#tlc").on('change', tlcChanged);
    $('#cmd').on('click', sendCmd)
    $('#close').on('click', close);
    $('#cmdLine').on('keydown', checkKey);
    $('#tlcStatus').on('click', statusRequest)
    let addr = `http://${location.hostname}:${port}`;
    socket = io.connect(addr);
    socket.on('connect', () => {
        setStatus('connected');
        $('.error').text('');

        socket.on('info', (msg) => {
            $('.error').text(msg);
        });
        socket.on('text', (msg) => {
            setStatus('open');
            let vwr = $('#viewer');
            let bfr = vwr.val();
            vwr.val(bfr+msg);
            if (vwr.length)
                vwr.scrollTop(vwr[0].scrollHeight - vwr.height());
        });
        socket.on('closed', () => {
            setStatus('connected');
            if (newTLc != 'none') {
                socket.emit('tlc', newTLc);
                newTLc = 'none';
            }
        });
        socket.on('error', (reason) => {
            console.log(reason);
        });
    });
    socket.on('disconnect', (reason) => {
        $('.error').text(`Disconnected: ${reason}`);
        setStatus('closed');
    });
});

function pushCmd() {
    cmdList.push($('#cmdLine').val());
    cmdIndex = cmdList.length - 1;
}

function selectPrevCmd() {
    if (cmdIndex == -1) return;
    if (cmdIndex != 0) {
        cmdIndex--;
    }
    $('#cmdLine').val(cmdList[cmdIndex]);
}

function selectNextCmd() {
    if (cmdIndex == -1) return;
    if (cmdIndex < (cmdList.length - 1)) {
        cmdIndex++;
    }
    $('#cmdLine').val(cmdList[cmdIndex]);
}

function checkKey(e) {
    switch (e.which) {
        case 13: sendCmd(); break;
        case 38: // Up
            selectPrevCmd(); break;
        case 40: // Down
            selectNextCmd(); break;
    }
}

function statusRequest() {
    socket.emit('status', '?');
}

function sendCmd() {
    let cmd;
    if (socket) {
        socket.emit('cmd', cmd = $('#cmdLine').val());
        pushCmd(cmd);
        $('#cmdLine').val('');
    } else {
        setStatus('closed');
        $('.error').text(`Connection is closed`);
    }
}

function close() {
    if (socket) {
        socket.emit('close', cmd);
        setStatus('connected');
    } else {
        setStatus('closed');
    }
}

function tlcChanged() {
    tlc = this.value;
    if (tlc == 'none') return;
    switch (status) {
        case 'connected': 
            socket.emit('tlc', tlc); 
            break;
        case 'open':
            newTLc = tlc; // Used to flag change to new TLc
            close();
            break;
        case 'closed':
             $('.error').text('Connection is closed');
            break;
    }
}

/* status values:
    'closed' - no connection
    'connected' - communicating with IoT Manager, not yet with TLc
    'open' - communicating with TLc
*/
function setStatus(s) {
    status = s;
    $('#status').text(s);
    if (s != 'open') $('#tlc').val('none');
}