
const MAXCHANNEL = 31
const MAXAREA = 10
const MAXNAME = 16
const MAXSCENECHANNEL = 64
const MAXSCENE = 31
const MAXTRIGGER = 60
const MAXSWITCHPLATE = 16

const macPattern = `^(?:[0-9a-fA-F]{2}\:){5}[0-9a-fA-F]{2}$`;
const namePattern = `^(?:[\\w\\- ]{1,${MAXNAME - 1}}|)$`;
const urlPattern = '^(?:[a-zA-Z0-9_]{2,100}\.){1,10}[a-zA-Z0-9_]{2,100}$'
const ipPattern = `^(?:[0-9]{1,3}\.){3}[0-9]{1,3}|$`;
const numberPattern = `^(?:[0-9]{1,3}|)$`;
const timePattern = `^(?:[0-4][0-9]:[0-3]0|)$`;
const boolPattern = `^(?:true|false|)$`;

const allSections = [
    { name: 'system', list: 'sysinfo' },
    { name: 'areas', list: 'arealist' },
    { name: 'scenes', list: 'scenelist' },
    { name: 'channels', list: 'channellist' },
    { name: 'switchplates', list: 'switchplatelist' },
    { name: 'triggers', list: 'triggerlist' },
    { name: 'scenechannels', list: 'scenechannellist' }
];

var tlc = 'none';

$(function () {
    $("#tlc").on('change', tlcChanged);
    $("#section").on('change', sectionChanged);
    $("#subSection").on('change', subSectionChanged);
    $('#save').on('click', saveConfig);
    $('#read').on('click', readConfig);
    $('#delete').on('click', deleteConfig);
    $('#display').on('click', showJSON);
    $('#upload').on('click', uploadConfig);
    $('#download').on('click', downloadConfig);
    $('button.help').on('click', showHelp);
    $('button.tlcOperation').removeProp('disabled').css('opacity', 0.3);
    makeReadList();
});

/* #region  General */
function setValidationClass(test, elem) {// NB don't use switchClass due to easing causing a delay
    if (test) { 
        elem.addClass('good');
        elem.removeClass('bad');
    } else {
        elem.addClass('bad');
        elem.removeClass('good');
    }
}

function updateValidation(parent) {
    $(`${parent} input[pattern]`).on('blur', (ev) => {
        var elem = $(ev.currentTarget);
        var pattern = new RegExp(elem.attr("pattern"));
        setValidationClass(pattern.test(elem.val()), elem);
    });
    $(`${parent} input:checkbox`).on('click', (ev) => {
        setValidationClass(true, $(ev.currentTarget));
    });
    $(`${parent} select`).on('change', (ev) => {
        setValidationClass(true, $(ev.currentTarget));
    });
}

function getSection(name, cb) {
    var t = tlcConfig.find(t => t.Name == tlc);
    $('.error').html(`${name} loading`);
    $.getJSON(`http://${t.IPaddress}:9073/${name}?serialNo=${t.serNo}&callback=?`)
        .then(d => cb(d))
        .fail(function (jqxhr, textStatus, error) {
            $('.error').html(`Can't get ${name}`);
            console.log(`Request for ${name} Failed: ${textStatus}, ${JSON.stringify(err)}`);
        });
}

function getList(name) {
    var t = tlcConfig.find(t => t.Name == tlc);
    $('.error').html(`${name} loading`);
    return $.getJSON(`http://${t.IPaddress}:9073/${name}?serialNo=${t.serNo}&callback=?`);
}

function selectRecord(r) {
    if ($(r).hasClass('selected')) {
        $(r).removeClass('selected');
        return false;
    } else {
        $(r).addClass('selected').siblings().removeClass('selected');
    }
    return true;
}

function checkFieldStatus(record) {
    var badCount = record.find('.bad').length;
    var goodCount = record.find('.good').length;
    if (badCount > 0) {
        $('.error').html('Correct bad fields first');
        return false;
    }
    $('.error').empty();
    if (goodCount == 0) return false; // Nothing changed
    return true;
}
/* #endregion */

/* #region  Create Inputs */

function addInput(label, id, fieldName, value, pattern, title) {
    let str = `<label style="margin-left: 5px;" class="${fieldName}lbl">${label}: `;
    str += `<input type="text" class="${fieldName}" name="${fieldName}" id="${id}" `;
    str += `value="${value}"`;
    if (pattern) str += ` pattern="${pattern}"`;
    if (title) str += ` title="${title}"`;
    str += `></label>`;
    return str;
}

function addSceneSpin(label, id, fieldName, value, pattern, title) {
    return addSpin('scenelist', -1, label, id, fieldName, (value == 255) ? -1 : value, title);
}

function addAreaSpin(label, id, fieldName, value, pattern, title) {
    return addSpin('arealist', -1, label, id, fieldName, (value == 255) ? -1 : value, title);
}

function addChannelSpin(label, id, fieldName, value, pattern, title) {

    return addSpin('channellist', -1, label, id, fieldName, (value == 255) ? -1 : value, title);
}

function addSwitchPlateSpin(label, id, fieldName, value, pattern, title) {
    return addSpin('switchplatelist', -1, label, id, fieldName, (value == 255) ? -1 : value, title);
}

function addSwitchButtonSpin(label, id, fieldName, value, pattern, title) {
    let str = `<label style="margin-left: 5px;">${label}: `;
    str += `<select class="${fieldName}" name="${fieldName}" id="${id}" `;
    if (title) str += ` title="${title}"`;
    str += `>`;
    let idx = 0;
    for (idx = 0; idx < 8; idx++) {
        str += `<option value="${idx}" ${(idx == value) ? ' selected' : undefined}>${idx}: SW${idx + 1}</option>`;
    };
    str += `<option value="${idx++}" ${(idx == value) ? ' selected' : undefined}>${idx}: PIR</option>`
    str += `<option value="${idx++}" ${(idx == value) ? ' selected' : undefined}>${idx}: Day/Night</option>`
    str += `<option value="15" ${(15 == value) ? ' selected' : undefined}>15: none</option>`
    str += '</select></label>';
    return str;
}

function addSwitchButtonActionSpin(label, id, fieldName, value, pattern, title) {
    let str = `<label style="margin-left: 5px;">${label}: `;
    str += `<select class="${fieldName}" name="${fieldName}" id="${id}" `;
    if (title) str += ` title="${title}"`;
    str += `>`;
    let idx = 0;
    str += `<option value="${idx++}" ${(idx == value) ? ' selected' : undefined}>${idx}: Pressed</option>`
    str += `<option value="${idx++}" ${(idx == value) ? ' selected' : undefined}>${idx}: Released Fast</option>`
    str += `<option value="${idx++}" ${(idx == value) ? ' selected' : undefined}>${idx}: Released Any</option>`
    str += `<option value="${idx++}" ${(idx == value) ? ' selected' : undefined}>${idx}: Pressed and Held</option>`
    str += '</select></label>';
    return str;
}

function addSpin(list, defaultOption, label, id, fieldName, value, title) {
    let str = `<label style="margin-left: 5px;" class="${fieldName}lbl">${label}: `;
    str += `<select class="${fieldName}" name="${fieldName}" id="${id}" `;
    if (title) str += ` title="${title}"`;
    str += `>`;
    if (defaultOption) {
        str += `<option value="${defaultOption}" ${(defaultOption == value) ? ' selected' : undefined}>${defaultOption}: none</option>`;
    }
    var t = tlcConfig.find(t => t.Name == tlc);
    // console.log(Array.isArray(t.config[list]))
    // let array = t.config[list].map(a => a);
    $(t.config[list]).each((idx, a) => {
        str += `<option value="${a.ID}" ${(a.ID == value) ? ' selected' : undefined}>${a.ID}: ${a.Name}</option>`;
    });
    str += '</select></label>';
    return str;
}

function addCheckBox(label, id, fieldName, value, title) {
    let str = `<label style="margin-left: 5px;" class="${fieldName}lbl">${label}: `;
    str += `<input type="checkbox" class="${fieldName}" name="${fieldName}" id="${id}" `;
    if (title) str += ` title="${title}"`;
    if (value) str += ` checked="checked"`;
    str += ` value="true">`;
    str += '</label>';
    return str;
}

/* #endregion */

/* #region  Config Backup  */
function makeReadList() {
    var items = Object.keys(localStorage);
    $('#readList').empty();
    items.forEach(item => $('#readList').append(`<option value="${item}">${item}</option>`))
}

function resetAllSections(t) {
    $('#section').val('none');
    $('#sectionData').empty();
    $('#subSection').val('none');
    $('#subSectionData').empty();
    if (t) {
        makeMetaTable(t.config.meta);
        makeSystemTable(t.config.sysinfo);
    } else {
        $(`#system.ipFields`).empty();
        $(`#meta.ipFields`).empty();
    }
}

function readConfig() {
    var t = tlcConfig.find(t => t.Name == tlc);
    $('.error').empty();
    let v = $('#readList').val();
    if (v) {
        try {
            let config = JSON.parse(localStorage.getItem(v));
            let tlcName = config.sysinfo.Name;
            if (tlc == 'none') {
                let t = tlcConfig.find(t => t.Name == tlcName);
                if (!t) {
                    $('.error').html(`${tlcName} is not registered with IoT Manager`);
                    return; // TODO create a new tlcConfig entry ??
                }
                t.config = config;
                $('select.loadSection').val(tlc = tlcName);
                resetAllSections(t);
            } else {
                if (tlc != tlcName) {
                    if (confirm(`File "${v}" contains info for "${tlcName}" not "${tlc}". Change to "${tlcName}"?`)) {
                        let t = tlcConfig.find(t => t.Name == tlcName);
                        t.config = config;
                        $('select.loadSection').val(tlc = tlcName);
                        resetAllSections(t);
                    }
                } else {
                    let t = tlcConfig.find(t => t.Name == tlcName);
                    t.config = config;
                    resetAllSections(t);
                }
            }
            $('.error').empty();
        } catch (ex) {
            $('.error').html(`${v} is possibly corrupt. Error is:  ${JSON.stringify(ex)}`);
        }
    } else {
        $('.error').html('Select an entry');
    }
}

function saveConfig() {
    var t = tlcConfig.find(t => t.Name == tlc);
    if (!t || !t.config || !t.config.meta) { $('.error').html('Select a TLc'); return; }
    let fileName = t.config.meta.Version;
    $('.error').empty();

    var notLoaded = [];
    allSections.forEach(s => { if (!t.config[s.list]) notLoaded.push(s.list) });
    if (notLoaded.length > 0) {
        if (!confirm(`${notLoaded} are missing. OK?`)) return;
    }
    localStorage.setItem(fileName, JSON.stringify(t.config));
    makeReadList();
    $('#readList').val(fileName);
}

function deleteConfig() {
    let v = $('#readList').val();
    if (v) {
        if (confirm(`Delete ${v}`)) {
            localStorage.removeItem(v);
            makeReadList();
        }
        $('.error').empty();
    } else {
        $('.error').html('Select an entry');
    }
}

function uploadConfig() {
    var t = tlcConfig.find(t => t.Name == tlc);
    if (!t.online) {
        $('.error').text(`${tlc} is offline`);
        return;
    }
    if (!t.config) { $('.error').text(`Configuration has not been set up`); return; }
    var notLoaded = [];
    allSections.forEach(s => { if (!t.config[s.list]) notLoaded.push(s.list) });
    if (notLoaded.length > 0) { $('.error').text(`${notLoaded} have not been set up`); return; }
    if (!confirm(`Upload configuration ${t.config.meta.Version} to file ${t.config.meta.File} on TLc ${tlc} ?`)) return;
    // TODO Post config and request load
}

function downloadConfig() {
    var promises = allSections.map(item => getList(item.name).then((y) => y));
    Promise.all(promises).then(results => {
        results.forEach((r, idx) => t.config[allSections[idx].list] = r.info);
        resetAllSections();
    });
}
/* #endregion */

/* #region  Help */
function showHelp() {
    if ($('body').find('#helpDiv').length > 0) return;
    let helpStr;
    let title = $(this).parent().text();
    switch ($(this).parent().attr('id')) {
        case 'selectTLcs': helpStr = getSelectTLcsHelp(); break;
        case 'metaInfo': helpStr = getMetaHelp(); break;
        case 'systemInfo': helpStr = getSystemHelp(); break;
        case 'triggers': helpStr = getTriggersHelp(); break;
        case 'areas': helpStr = getAreasHelp(); break;
        case 'scenes': helpStr = getScenesHelp(); break;
        case 'switchplates': helpStr = getSwitchplatesHelp(); break;
        case 'channels': helpStr = getChannelsHelp(); break;
        case 'scenechannels': helpStr = getSceneChannelsHelp(); break;
        default: $('.error').text('Help not set up'); return;
    }
    $('.error').empty();
    var p = $(this).parent();
    let str = '<div id="helpDiv" class="helpDiv">';
    str += `<p><h4>Help - ${title}</h4> <button class="helpDone">X</button></p>`;
    str += helpStr;
    str += '</div>';
    $(p).append(str);
    $('#helpDiv').draggable();
    $('.helpDone').on('click', () => { $('#helpDiv').remove() });
    return false;
}
/* #endregion */

/* #region  TLc Edits */
function getSelectTLcsHelp() {
    let str = '';
    str += '<p>A TLc needs to be selected from the set that the IoT Manager has connected to.';
    str += 'This selection can be via the <i>Choose TLc</i> drop down ';
    str += '(which reads the current settings from the selected TLc) ';
    str += 'or by choosing the name of a local storage file dropdown and clicking the adjacent Read button.</p>';
    str += '<p>The (edited) settings can be saved to a local storage file by clicking the Save button.';
    str += 'The name of the file will be that in the Meta section (see Meta help). ';
    str += 'To delete a local storage file select the required fiel from the dropdown and click Delete.</p>';
    str += '<p>Click Upload (TODO) to send the updated settings to the chosen TLc.';
    str += 'The current settings can be re-downloaded from the from the chosen TLc by clicking Download.</p>';
    str += '';

    return str;
}

// TODO Deal with different approaches when dealing with downloaded vs stored configs
function tlcChanged(event) {
    tlc = this.value;
    if (tlc == 'none') {
        resetAllSections(); 
        return;    
    }
    var t = tlcConfig.find(t => t.Name == tlc);
    if (!t) { // 'none' ?
        $('#system').empty();
        $('button.tlcOperation').prop('disabled', true).css('opacity', 0.3);
        return;
    }
    if (t.config) {
        if (t.config.sysinfo) {
            makeSystemTable(t.config.sysinfo);
        } else {
            getSection('system', (data) => {
                updataSystem(data);
                if (!t.meta) {
                    makeMetaTable(t.config.meta);
                } else {
                    getMeta(updateMeta);
                }
            });
        }
        if (!t.config.meta) {
            makeMetaTable(t.config.meta);
        } else {
            getMeta(updateMeta);
        }
    } else {
        getSection('system', (data) => {
            updateSystem(data);
            getMeta(updateMeta);
        });
    }
    $('#section').val('none');
    $('#sectionData').empty();
    $('#subSection').val('none');
    $('#subSectionData').empty();
}

function showJSON() {
    if ($('body').find('#jsonDiv').length > 0) return;
    var t = tlcConfig.find(t => t.Name == tlc);
    let displayStr = JSON.stringify(t.config, null, 4);
    displayStr = displayStr.replace('],', '],\n');
    $('.error').empty();
    var p = $(this).parent();
    let str = '<div id="jsonDiv" class="jsonDiv">';
    str += `<p><h4>JSON for: ${tlc}</h4> <button class="jsonDone">X</button></p>`;
    str += `<textarea class="jsonDisplay">${displayStr}</textarea>`;
    str += '</div>';
    $(p).append(str);
    $('#jsonDiv').draggable();
    $('.jsonDone').on('click', () => { $('#jsonDiv').remove() });
    return false;
}
/* #endregion */

/* #region  System */
function updateSystem(data) {
    makeSystemTable(data.info);
    var t = tlcConfig.find(t => t.Name == tlc);
    if (!t.config) t.config = {};
    t.config.sysinfo = data.info;
    $('button.tlcOperation').removeProp('disabled').css('opacity', 1);
}

function makeSystemTable(data) {
    var lbl;
    var str = '<fieldset>'
    lbl = addInput('Name', 'systemName', 'systemName',
        data.Name, namePattern, 'Up to 15 name characters');
    str += `<div>${lbl}</div>`;
    lbl = addInput('MAC', 'systemMAC', 'systemMAC',
        data.MACaddress, macPattern, "aa:aa:aa:aa:aa:aa");
    str += `<div>${lbl}\</div>`;
    lbl = addInput('NTP', 'systemNTP', 'systemNTP',
        data.NTPpool, urlPattern, "A url");
    str += `<div>${lbl}</div>`;
    str += "</fieldset><fieldset>"
    lbl = addInput('IP', 'systemIP', 'systemIP',
        data.IPaddress, ipPattern, "ddd.ddd.ddd.ddd");
    str += `<div>${lbl}</div>`;
    lbl = addInput('GW', 'systemGW', 'systemGW',
        data.GatewayIP, ipPattern, "ddd.ddd.ddd.ddd");
    str += `<div>${lbl}</div>`;
    lbl = addInput('DNS', 'systemDNS', 'systemDNS',
        data.DNSaddress, ipPattern, "ddd.ddd.ddd.ddd");
    str += `<div>${lbl}</div>`;
    lbl = addInput('SubNet', 'systemSubNet', 'systemSubNet',
        data.SubNetmask, ipPattern, "ddd.ddd.ddd.ddd");
    str += `<div>${lbl}</div>`;
    str += "</fieldset>"
    str += '<button id="systemAction">Update</button>';
    $('#system').html(str);
    $('#system input').css('width', '10em');
    $("#systemAction").on('click', systemAction);
    updateValidation('#system.ipFields');
}

function getSystemHelp() {
    let str = '';
    str += '<p>The <i>Name</i> field is used as a key to access each TLc. ';
    str += 'Only those TLc\'s registered in the config file can be accessed.';
    str += 'If the <i>Name</i> is changed you will have to update that file.</p>';
    str += '<p>The <i>MAC</i> address field is used to configure the ethernet interface on the TLc. ';
    str += 'As this is set up be the TLc you should edit this to ensure they are unique within the local network. </p>';
    str += '<p>The <i>NTP</i> field contains the URL of the pool of NTP servers. </p>';
    str += '<p>The <i>IP/i> fields are used by the TLc to set up its IP address etc. ';
    str += 'Normally you\'ll just want to set the last byte of the IP address to 000 ';
    str += 'for the TLc to use a DHCP lookup.</p>';
    return str;
}

function systemAction(data) {
    function checkNull(cls) {
        let val = record.find(cls).val();
        if (val == '') return null;
        return `${val}`;
    }
    var record = $(this).parent();
    var badCount = record.find('input.bad').length;
    var goodCount = record.find('input.good').length;
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    if (badCount > 0) {
        $('.error').html('Correct bad fields first');
        return;
    }
    $('.error').empty();
    if (goodCount == 0) return; // Nothing changed
    tc.sysinfo = {
        Name: record.find('.systemName').val(),
        MACaddress: record.find('.systemMAC').val(),
        NTPpool: record.find('.systemNTP').val(),
        IPaddress: checkNull('.systemIP'),
        SubNetMask: checkNull('.systemSubNet'),
        GatewayIP: checkNull('.systemGW'),
        DNSaddress: checkNull('.systemDNS')
    };
    record.find('input.good').removeClass('good');
}
/* #endregion */

/* #region  Meta */
function getMeta(cb) {
    var t = tlcConfig.find(t => t.Name == tlc);
    url = `/tlcEdit/getMeta?tlc=${t.Name}`; // Needs to be done via host
    $.getJSON(url, cb)
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Meta Request Failed: " + err);
        });
}

function updateMeta(data) {
    var m = data.find((m) => m.meta.Type == "Config");
    makeMetaTable(m.meta);
    var t = tlcConfig.find(t => t.Name == tlc);
    if (!t.config) t.config = {};
    t.config.meta = m.meta;
}

function makeMetaTable(meta) {
    var lbl;
    var str = '';
    lbl = addInput('Version', 'metaVersion', 'metaVersion',
        meta.Version, namePattern, "Give version a name");
    str += `<div>${lbl}</div>`;
    lbl = addInput('File', 'metaFile', 'metaFile',
        meta.File, numberPattern, "Small decimal number");
    str += `<div>${lbl}</div>`;
    str += '<button id="metaAction">Update</button>';
    $('#meta').html(str);
    $('#metaVersion').css('width', '10em')
    $('#metaFile').css('width', '1em')
    $("#metaAction").on('click', metaAction);
    updateValidation('#meta.ipFields');
}

function getMetaHelp() {
    let str = '';
    str += '<p>The <i>Meta</i> information in this section is used to control the storing \
                of the settings locally and in the TLcs. \
                Both thes fields are stored in the TLc.</p>';
    str += '<p>The </i>Version</i> enables separate updated versions of the configuration\
            to be managed. It is used as a key to retrieve the version stored in the browser\'s localStorage.</p>';
    str += '<p>The <i>File</i> (which must be a small number) acts as a file name\
            in the TLc\'s file system.0</p>';
    return str;
}

function metaAction() {
    var record = $(this).parent();
    var badCount = record.find('input.bad').length;
    var goodCount = record.find('input.good').length;
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    if (badCount > 0) {
        $('.error').html('Correct bad fields first');
        return;
    }
    $('.error').empty();
    if (goodCount == 0) return; // Nothing changed
    tc.meta = {
        Type: 'Config',
        Version: record.find('.metaVersion').val(),
        File: record.find('.metaFile').val()
    };
    record.find('input.good').removeClass('good');
}
/* #endregion */

// ***************************Section edits
function sectionChanged(event) {
    if (tlc == 'none') {
        $('.error').html('TLc not selected');
        $(this).val('none')
        return;
    }
    $('.error').empty();
    var t = tlcConfig.find(t => t.Name == tlc);
    if (!t) { // 'none' ?
        $('#section').empty();
        return;
    }

    var section = this.value;
    $('#subSection').val('none');
    $('#subSectionData').empty();
    var names = [];
    switch (section) {
        case 'none':
            $('#sectionData').empty();
            $('#dataSections').removeAttr('colspan');
            $('#dataSubSections').show();
            break;
        case "Area":
            if (t.config) {
                if (!t.config.arealist) names.push({ name: 'areas', list: 'arealist' });
                if (!t.config.switchplatelist) names.push({ name: 'switchplates', list: 'switchplatelist' });
                if (!t.config.channellist) names.push({ name: 'channels', list: 'channellist' });
                var promises = names.map(item => getList(item.name).then((y) => y));
                Promise.all(promises).then(results => {
                    results.forEach((r, idx) => t.config[names[idx].list] = r.info);
                    $("#subSection option").removeAttr("disabled"); // Channels and Switches enabled
                    $('#dataSections').removeAttr('colspan');
                    $('#dataSubSections').show();
                    makeAreaTable(t.config.arealist);
                });
            }
            break;
        case "Scene":
            if (t.config) {
                if (!t.config.scenelist) names.push({ name: 'scenes', list: 'scenelist' });
                if (!t.config.scenechannellist) names.push({ name: 'scenechannels', list: 'scenechannellist' });
                if (!t.config.triggerlist) names.push({ name: 'triggers', list: 'triggerlist' });
                var promises = names.map(item => getList(item.name).then((y) => y));
                Promise.all(promises).then(results => {
                    results.forEach((r, idx) => t.config[names[idx].list] = r.info);
                    $("#subSection option").removeAttr("disabled"); // Switches disabled
                    $("#subSection option[value='Switches']").attr("disabled", "disabled");
                    $('#dataSections').removeAttr('colspan');
                    $('#dataSubSections').show();
                    makeSceneTable(t.config.scenelist);
                });
            }
            break;
        case "Trigger":
            if (t.config) {
                var names = [];
                if (!t.config.arealist) names.push({ name: 'areas', list: 'arealist' });
                if (!t.config.switchplatelist) names.push({ name: 'switchplates', list: 'switchplatelist' });
                if (!t.config.scenelist) names.push({ name: 'scenes', list: 'scenelist' });
                if (!t.config.triggerlist) names.push({ name: 'triggers', list: 'triggerlist' });
                var promises = names.map(item => getList(item.name).then((y) => y));
                Promise.all(promises).then(results => {
                    results.forEach((r, idx) => t.config[names[idx].list] = r.info);
                    $("#subSection option").attr("disabled", "disabled");
                    $("#subSection option[value='none']").removeAttr("disabled");
                    $('#dataSections').attr('colspan', 2);
                    $('#dataSubSections').hide();
                    makeTriggerTable(t.config.triggerlist);
                })
                    .catch(err => $('.error').html(`Downloading Error ${JSON.stringify(err)}`));
            }
            break;
    }
}

/* #region  Area */
function checkSelectedArea() {
    let selectedAreaID;
    if (selectRecord(this)) {
        selectedAreaID = $(this).find('input').val();
    } // else undefined
    var t = tlcConfig.find(t => t.Name == tlc);
    switch ($('#subSection').val()) {
        case 'none': return;
        case 'Channels':
            makeChannelTable(t.config.channellist, selectedAreaID);
            break;
        case 'Switches':
            makeSwitchTable(t.config.switchplatelist, selectedAreaID);
            break;
    }
}

function makeAreaTable(arealist) {
    var idx = 0;
    var str = '<h3 id="areas" style="width: 100%">Areas<button class="help"> ? </button></h3>';
    arealist.forEach(area => {
        str += `<div class="ipFields" idx="${idx}">`;
        str += addInput('ID', 'areaID' + area.ID, 'areaID',
            area.ID, numberPattern, "0-9");
        str += addInput('Name', 'areaName' + area.ID, 'areaName',
            area.Name, namePattern, 'Up to 15 name characters');
        str += '<button class="areaAction">Update</button>';
        str += '<button class="areaDelete">Delete</button>';
        str += '</div>';
        idx++;
    });
    if (arealist.length < 10) {
        str += '<div class="ipFields" title="Click to select">';
        str += addInput('ID', 'areaID-new', 'areaID',
            "", numberPattern, "0-9");
        str += addInput('Name', 'areaName-new', 'areaName',
            "", namePattern, "Up to 15 name characters");
        str += '<button class="areaAdd">Add</button>';
        str += '</div>';
    } else {
        $('.error').html(`Reached max Areas (${MAXAREA})`)
    }
    $('.error').empty();
    $('#sectionData').html(str);
    $('.areaName').css('width', '10em');
    $('.areaID').css('width', '1em');
    $('.areaAction').on('click', areaAction);
    $('.areaAdd').on('click', areaAdd);
    $('.areaDelete').on('click', areaDelete);
    updateValidation('#sectionData.ipFields');
    $('div#sectionData.ipFields div').on('click', checkSelectedArea);
    $('button.help').on('click', showHelp);
}

function makeAreaObject(record) {
    var newArea = {
        ID: record.find("input.areaID").val(),
        Name: record.find("input.areaName").val()
    };
    return newArea;
}

function areaAction(data) {
    var record = $(this).parent();
    if (!checkFieldStatus(record)) return;
    var newArea = makeAreaObject(record);
    var recIndex = record.attr("idx");
    var oldAreaID = -1;
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    let duplicate = false;
    let changedID;
    $('.error').empty();
    tc.arealist.forEach((a, idx) => {
        if (idx == recIndex) {
            changedID = (a.ID != newArea.ID); // true => areaID has changed 
            if (changedID) oldAreaID = a.ID;
        } else {
            if (a.ID == newArea.ID) duplicate = true;
        }
    });
    if (duplicate) {
        $('.error').text(`${newArea.ID} is a duplicate`);
        return;
    }
    let updateOK = false;
    if (changedID) {
        searchAreaUsage(newArea.ID, (channelList, switchList) => {
            if (channelList.length == 0 && switchList.length == 0) return;
            if (!confirm(`Channels ${channelList} and/or Switches ${switchList} need updating; OK?`)) return;
            updateAllChannelAreas(oldAreaID, newArea.ID, tc.channellist, tc.arealist);
            updateAllSwitchPlateAreas(oldAreaID, newArea.ID, tc.switchplatelist);
            updateOK = true;
        });
        if (updateOK) {
            tc.arealist[recIndex] = newArea;
            makeAreaTable(tc.arealist);
            switch ($('#subSection').val()) {
                case 'Channels':
                    makeChannelTable(tc.channellist); break;
                case 'Switches':
                    makeSwitchPlateTable(tc.switchplatelist); break;
            }
        }
    } else {
        tc.arealist[recIndex] = newArea;
        makeAreaTable(tc.arealist);
    }
}

function areaAdd() {
    var record = $(this).parent();
    var newArea = makeAreaObject(record);
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    var existingID = tc.arealist.find(a => a.ID == newArea.ID);
    if (existingID) {
        $('.error').html(`Area ${newArea.ID} is already used`)
    } else if (!newArea.ID || !newArea.Name) {
        $('.error').html(`Please supply an ID and a Name`)
    } else {
        tc.arealist.push(newArea);
        makeAreaTable(tc.arealist);
        $('.error').empty();
    }
}

function areaDelete() {
    var record = $(this).parent();
    var areaID = record.find("input.areaID").val();
    var recIndex = record.attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    let foundAreaUsed;
    searchAreaUsage(areaID, (channelList, switchList) => {
        foundAreaUsed = !(channelList.length == 0 && switchList.length == 0);
        if (foundAreaUsed) $('.error').text(`Channels ${channelList} and/or Switches ${switchList} use Area ${areaID}`);
    });
    $('.error').empty();
    if (foundAreaUsed) return;
    if (confirm(`Delete Area ${tc.arealist[recIndex].ID}/${tc.arealist[recIndex].Name}?`)) {
        tc.arealist.splice(recIndex, 1);
        makeAreaTable(tc.arealist);
    }
}

function getAreasHelp() {
    let str = '';

    str += `<p>This is a list of areas that have lights that are controlled by the selected TLc. `;
    str += `These areas are refeneced by the <i>channels</i> and <i>switchplates</i>. `;
    str += `It is expected that the lights connected to these channels and `;
    str += `the switches will physically be in the areas referenced.</p>`;
    str += `<p>Note that if an <i>area ID</i> is changed you are given the option to \
            update the referencing IDs `;
    str += `in the channel and sitch records. If you change the Area name without changing the ID `;
    str += `the channel record will (TODO) be updated as it also contains the name.</p>`;
    str += `<p>Note also that scenes can control channels that are in different areas, \
            e.g. to turn all off.</p>`
    str += `<p><u>General Notes</u> (These also apply to other sections). \
            When you click anywhere in a record it is marked as selected\
            (or un marked if already selected) and the background se tto light blue. </p>`
    str += `<p>When you finish changing a field and click somewher else the field 
            is validated and its background set to green if OK or red if not. The Update \
            will only be actioned if there are no red fields and at least one green. NB if \
            you correctly edit a field and click directly on Update you will not see the field go green.</p>`;
    str += `<p>You will be warned if you create or adit a field to give it a duplicate ID.</p>`;
    str += `<p>You will be warned if there are other records (e.g. Channels) that reference the Area.</p>`;
            return str;
}

function searchAreaUsage(area, cb) {
    var channels = [];
    var switches = [];
    searchChannelsforArea(area, (c) => channels.push(c));
    searchSwitchesforArea(area, (s) => switches.push(s));
    if (cb) cb(channels, switches);
}

/* #endregion */

/* #region  Scene */
function checkSelectedScene() {
    let selectedSceneID;
    if (selectRecord(this)) {
        selectedSceneID = $(this).find('input').val();
    } // else undefined
    var t = tlcConfig.find(t => t.Name == tlc);
    switch ($('#subSection').val()) {
        case 'none': return;
        case 'Channels':
            makeSceneChannelTable(t.config.scenechannellist, selectedSceneID);
            break;
        case 'Switches':
            break;
    }
}

function makeSceneTable(scenelist) {
    var idx = 0;
    var str = '<h3 id="scenes" style="width: 100%">Scenes<button class="help"> ? </button></h3>';
    scenelist.forEach(scene => {
        str += `<div class="ipFields" idx="${idx}">`;
        str += addInput('ID', 'sceneID' + idx, 'sceneID',
            scene.ID, numberPattern, `0-${MAXSCENE - 1}`);
        str += addInput('Name', 'sceneName' + idx, 'sceneName',
            scene.Name, namePattern, `Up to ${MAXNAME - 1} name characters`);
        str += '<fieldset><legend>Timing</legend>';
        str += addInput('FadeIn', 'FadeIn' + idx, 'FadeIn',
            scene.FadeIn, numberPattern, "0-255");
        str += addInput('Duration', 'Duration' + idx, 'Duration',
            scene.Duration, numberPattern, "0-255");
        str += addInput('FadeOut', 'FadeOut' + idx, 'FadeOut',
            scene.FadeOut, numberPattern, "0-255");
        str += '</fieldset>';
        str += '<fieldset><legend>Follow-On</legend>';
        str += addSceneSpin('NextScene', 'NextScene' + idx, 'NextScene',
            scene.NextScene, numberPattern, `0-${MAXSCENE - 1}`);
        // TODO encode/decode StartTime field
        str += addInput('StartTime', 'StartTime' + idx, 'StartTime',
            scene.StartTime, timePattern, "0-42:ss in steps of 10S");
        str += addCheckBox('FadePrev', 'FadePrev' + idx, 'FadePrev',
            scene.FadePrev, "true or false");
        str += '</fieldset>';
        str += '<button class="sceneAction">Update</button>';
        str += '<button class="sceneDelete">Delete</button>';
        str += '</div>';
        idx++;
    });
    if (scenelist.length < MAXSCENE) {
        str += '<div class="ipFields">';
        str += addInput('ID', 'sceneID-new', 'sceneID',
            "", numberPattern, "0-9");
        str += addInput('Name', 'sceneName-new', 'sceneName',
            "", namePattern, `Up to ${MAXNAME - 1} name characters`);
        str += '<fieldset><legend>Timing</legend>';
        str += addInput('FadeIn', 'FadeIn-new', 'FadeIn',
            0, numberPattern, "0-255");
        str += addInput('Duration', 'Duration-new', 'Duration',
            0, numberPattern, "0-255");
        str += addInput('FadeOut', 'FadeOut-new', 'FadeOut',
            0, numberPattern, "0-255");
        str += '</fieldset>';
        str += '<fieldset><legend>Follow-On</legend>';
        str += addSceneSpin('NextScene', 'NextScene-new', 'NextScene',
            -1, numberPattern, `0-${MAXSCENE - 1}`);
        str += addInput('StartTime', 'StartTime-new', 'StartTime',
            '42:30', timePattern, "0-42:ss in steps of 10S");
        str += addCheckBox('FadePrev', 'FadePrev-new', 'FadePrev',
            false, "true or false");
        str += '</fieldset>';
        str += '<button class="sceneAdd">Add</button>';
        str += '</div>';
        $('.error').empty();
    } else {
        $('.error').html(`Reached max Areas (${MAXSCENE})`)
    }
    $('#sectionData').html(str);
    $('.sceneName,.NextScene').css('width', '8em')
    $('.StartTime').css('width', '3em')
    $('.sceneID,.FadeIn,.FadeOut,.Duration').css('width', '2em')
    $('.sceneAction').on('click', sceneAction);
    $('.sceneAdd').on('click', sceneAdd);
    $('.sceneDelete').on('click', sceneDelete);
    updateValidation('#sectionData.ipFields');
    $('div#sectionData.ipFields div').on('click', checkSelectedScene);
    $('button.help').on('click', showHelp);
}

function makeSceneObject (rec) {
    var newScene = {
        ID: $(rec).find("input.sceneID").val(),
        Name: $(rec).find("input.sceneName").val(),
        FadeIn: $(rec).find("input.FadeIn").val(),
        Duration: $(rec).find("input.Duration").val(),
        FadeOut: $(rec).find("input.FadeOut").val(),
        FadePrev: $(rec).find("input.FadePrev").prop('checked'),
        NextScene: $(rec).find("input.NextScene").val(),
        StartTime: $(rec).find("input.StartTime").val()
    };
    return newScene
}

function sceneAction() {
    var record = $(this).parent();
    $('.error').empty();
    if (!checkFieldStatus(record)) return;
    var newScene = makeSceneObject(record);
    var recIndex = $(record).attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    let duplicate = false;
    let changedID = false;;
    tc.scenelist.forEach((sc, idx) => {
        if (idx == recIndex) {
            changedID = (sc.ID != newScene.ID); // true => scene.ID has changed 
            // if (changedID) oldScene = {...a};
        } else {
            if (sc.ID == newScene.ID) duplicate = true;
        }
    });
    if (duplicate) {
        $('.error').text(`${newScene.ID} is a duplicate`);
        return;
    }
    let updatesOutstanding = false;
    if (changedID) {
        searchSceneUsage(newScene.ID, (scenechannelList, triggerList) => {
            if (scenechannelList.length == 0 && triggerList.length == 0) return;
            $('.error').text(`Channels ${channelList} and/or Triggers ${triggerList} need updating; OK?`);
            // TODO Could update SceneChannels and Triggers
            updatesOutstanding = true;
        });
        if (updatesOutstanding) return;
    }
    tc.scenelist[recIndex] = newScene;
    makeSceneTable(tc.scenelist);
}

function sceneAdd() {
    var record = $(this).parent();
    var newScene = makeSceneObject(record);
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    var existingID = tc.scenelist.find(sc => sc.ID == newScene.ID);
    if (existingID) {
        $('.error').html(`Scene ${newScene.ID} is in use`);
    } else if (!newScene.ID || !newScene.Name) {
        $('.error').html(`Please supply an ID and a Name`);
    } else {
        tc.scenelist.push(newScene);
        makeSceneTable(tc.scenelist);
        $('.error').empty();
    }
}

function sceneDelete(data) {
    var record = $(this).parent();
    var newScene = makeSceneObject(record);
    var recIndex = record.attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    var sceneName = tc.scenelist.find(s => s.ID == newScene.ID).Name;
    let foundSceneUsed;
    $('.error').empty();
    searchSceneUsage(newScene.ID, (scenechannelList, triggerList) => {
        foundSceneUsed = !(scenechannelList.length == 0 && triggerList.length == 0);
        if (foundSceneUsed) 
            $('.error').text(`Scene-Channels ${sceneName}-[${scenechannelList}]
                and/or Triggers ${triggerList} use Scene ${newScene.ID}`);
    });
    if (foundSceneUsed) return; // Must manually remove these uses
    if (confirm(`Delete Scene ${tc.scenelist[recIndex].ID}/${tc.scenelist[recIndex].Name}?`)) {
        tc.scenelist.splice(recIndex, 1);
        makeSceneTable(tc.scenelist);
    }
}

function getScenesHelp() {
    let str = '';
    str += `<p><i>Scenes</i> (along with the associated sets of Channels) define the light settings \
            of a set of Channels. Choose Channels in the RH panel to view the Channels and their settings</p>`;
    str += `<p>The Timing fields control FadeIn (how quickly, in units of 50mS, the light level is ramped up to the target value), \
            Duration (how long the Scene will last, in units of 1S) \
            and FadeOut (how quickly ,in units of 50mS, the light level is ramped either to 0 if \
            no follow-on Scene or to the next Scene's level).</p>`;
    str += `<p>If the FadeOut and Duration fields are both 0 the Scene will last indefinitely.</p>`;
    str += `<p>The Follow-On fields enable another Scene to be started after the time set by the Duration value.\
            </p>`
    // TODO More help
    str += '';
    return str;
}

function searchSceneUsage(scene, cb) {
    var scenechannels = [];
    var triggers = [];
    searchSceneChannelsforScene(scene, (c) => scenechannels.push(c));
    searchTriggersforScene(scene, (t) => triggers.push(t));
    if (cb) cb(scenechannels, triggers);
}
/* #endregion */

/* #region  Trigger */
function getTriggersHelp() {
    let str = '';

    str += '<p>This is a list of events that can cause a change of scene. ';
    str += 'The list is scanned to find a record that matches and the selected scene activated.</p>';
    str += '<p>The main criterea for triggering the scene is usually a button on the specified <i>Switch Plate</i> being pressed.</p>';
    // TODO More help
    return str;
}

function makeTriggerTable(triggerlist) {
    var idx = 0;
    var str = '<h3 id="triggers">Triggers<button class="help"> ? </button></h3>';
    triggerlist.forEach(trigger => {
        str += `<div>${idx}</div>`;
        str += `<div class="ipFields" idx="${idx}">`;
        str += '<fieldset><legend><strong>When</strong> Input</legend>';
        str += addSwitchPlateSpin('Switch Plate', 'ipSWplate' + idx, 'ipSWplate',
            trigger.IPtrigger.swPlate, numberPattern, "0-255");
        str += addSwitchButtonSpin('button', 'ipSWbtn' + idx, 'ipSWbtn',
            trigger.IPtrigger.swBtn, numberPattern, "0-15");
        str += addSwitchButtonActionSpin('is', 'ipAction' + idx, 'ipAction',
            trigger.IPtrigger.Action, numberPattern, "0-3");
        str += '</fieldset>';

        str += addSceneSpin('<strong>Start</strong> Scene', 'triggerSceneID' + idx, 'triggerSceneID',
            trigger.SceneID, numberPattern, `0-${MAXSCENE - 1}`);

        str += addCheckBox('<strong>and</strong> if Filters Enabled', 'FiltersEnabled' + idx, 'FiltersEnabled',
            trigger.FiltersEnabled, "true or false");

        str += '<fieldset><legend><strong>then</strong> check State of</legend>';
        str += addSwitchPlateSpin('SWplate', 'stSWplate' + idx, 'stSWplate',
            trigger.IPstate1.swPlate, numberPattern, "0-255");
        str += addSwitchButtonActionSpin('SWbtn', 'stSWbtn' + idx, 'stSWbtn',
            trigger.IPstate1.swBtn, numberPattern, "0-15");
        str += addInput('is', 'stState' + idx, 'stState',
            trigger.IPstate1.state, numberPattern, "0-255");
        str += '</fieldset>';

        str += addCheckBox('Filters <strong>And</strong>', 'FiltersAnd' + idx, 'FiltersAnd',
            trigger.AndFilters, "true or false");

        str += '<fieldset><legend>Last Scene</legend>';
        str += addAreaSpin('AreaID', 'lsAreaID' + idx, 'lsAreaID',
            trigger.LastScene.AreaID, numberPattern,`0-${MAXAREA-1}`);
        str += addSceneSpin('SceneID', 'lsSceneID' + idx, 'lsSceneID',
            trigger.LastScene.notScene, boolPattern, `0-${MAXSCENE-1}`);
        str += addCheckBox('! Scene', 'notScene' + idx, 'notScene',
            trigger.LastScene.notScene, "true or false");
        str += '</fieldset>';

        str += '<button class="triggerAction">Update</button>';
        str += '<button class="triggerDelete">Delete</button>';
        str += '</div>';
        idx++;
    });
    if (triggerlist.length < MAXTRIGGER) {
        str += '<fieldset><legend>Input</legend>';
        str += addSwitchPlateSpin('When Switch Plate', 'ipSWplate-new', 'ipSWplate',
            -1, numberPattern, "0-255");
        str += addSwitchButtonSpin('button', 'ipSWbtn-new', 'ipSWbtn',
            -1, numberPattern, "0-7");
        str += addSwitchButtonActionSpin('is', 'ipAction-new', 'ipAction',
            0, numberPattern, "0-255");
        str += '</fieldset>';

        str += addSceneSpin('Start Scene', 'triggerSceneID-new', 'triggerSceneID',
            -1, numberPattern, `0-${MAXSCENE - 1}`);

        str += addCheckBox('and if Filters Enabled', 'FiltersEnabled-new', 'FiltersEnabled',
            false, "true or false");

        str += '<fieldset><legend>then check State of</legend>';
        str += addSwitchPlateSpin('SWplate', 'stSWplate-new', 'stSWplate',
            -1, numberPattern, "0-255");
        str += addSwitchButtonActionSpin('SWbtn', 'stSWbtn-new', 'stSWbtn',
            -1, numberPattern, "0-7");
        str += addInput('is', 'stState-new', 'stState',
            0, numberPattern, "0-255");
        str += '</fieldset>';

        str += addCheckBox('FiltersAnd', 'FiltersAnd-new', 'FiltersAnd',
            false, "true or false");

        str += '<fieldset><legend>Last Scene</legend>';
        str += addAreaSpin('AreaID', 'lsAreaID-new', 'lsAreaID',
            -1, numberPattern, `0-${MAXAREA-1}`);
        str += addSceneSpin('SceneID', 'lsSceneID-new', 'lsSceneID',
            -1, boolPattern, `0-${MAXSCENE-1}`);
        str += addCheckBox('! Scene', 'notScene-new', 'notScene',
            false, "true or false");
        str += '</fieldset>';
        str += '<button class="triggerAdd">Add</button>';
        str += '</div>';
    } else {
        $('.error').html(`Reached max Triggers (${MAXTRIGGER})`)
    }
    $('#sectionData').html(str);
    $('.triggerSceneIDlbl,.FiltersAndlbl,.FiltersEnabledlbl').addClass('standAlone');
    $('.triggerSceneID,.lsAreaID,.lsSceneID').css('width', '12em')
    $('.ipSWplate,.ipSWbtn,.ipAction').css('width', '8em');
    $('.stSWplate,.stSWbtn,.stState').css('width', '8em');
    $('.triggerAction').on('click', triggerAction);
    $('.triggerAdd').on('click', triggerAdd);
    $('.triggerDelete').on('click', triggerDelete);
    updateValidation('#sectionData.ipFields');
    $('div#sectionData.ipFields div').on('click', selectRecord)
    $('button.help').on('click', showHelp);
}

function equalTrigger(o1, o2) {
    if (o1.IPtrigger.swPlate != o2.IPtrigger.swPlate) return false;
    if (o1.IPtrigger.swBtn != o2.IPtrigger.swBtn) return false;
    if (o1.IPtrigger.Action != o2.IPtrigger.Action) return false;
    if (o1.SceneID != o2.SceneID) return false;
    if (o1.IPstate1.swPlate != o2.IPstate1.swPlate) return false;
    if (o1.IPstate1.swBtn != o2.IPstate1.swBtn) return false;
    if (o1.IPstate1.state != o2.IPstate1.state) return false;
    if (o1.AndFilters != o2.AndFilters) return false;
    if (o1.LastScene.AreaID != o2.LastScene.AreaID) return false;
    if (o1.LastScene.SceneID != o2.LastScene.SceneID) return false;
    if (o1.LastScene.notScene != o2.LastScene.notScene) return false;

    return true;
}

function makeTriggerObject(rec) {
    var newTrigger = {
        ID: $(rec).attr("idx"),
        IPtrigger: {
            swPlate: $(rec).find('select.ipSWplate').val(),
            swBtn: $(rec).find('select.ipSWbtn').val(),
            Action: $(rec).find('select.ipAction').val()
        },
        SceneID: parseInt($(rec).find('select.triggerSceneID').val()),
        IPstate1: {
            swPlate: $(rec).find('select.stSWplate').val(),
            swBtn: $(rec).find('select.stSWbtn').val(),
            state: $(rec).find('input.stState').val()
        },
        AndFilters: $(rec).find('input.FiltersAnd').prop('checked'),
        FiltersEnabled: $(rec).find('input.FiltersEnabled').prop('checked'),
        LastScene: {
            AreaID: parseInt($(rec).find('select.lsAreaID').val()),
            SceneID: parseInt($(rec).find('select.lsSceneID').val()),
            notScene: $(rec).find('input.notScene').prop('checked')
        }
    };
    return newTrigger;
}

function triggerAction(data) {
    var record = $(this).parent();
    $('.error').empty();
    if (!checkFieldStatus(record)) return; // Nothing edited
    var recIndex = $(record).attr("idx");
    var oldTrigger = {};
    var newTrigger = makeTriggerObject(record);
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;

    let duplicate = false;
    let changed = false;
    $('.error').empty();
    tc.triggerlist.forEach((t, idx) => {
        if (idx == recIndex) {
            changed = !equalTrigger(t, newTrigger);
            if (changed) oldTrigger = { ...t };
        } else {
            duplicate = equalTrigger(t, newTrigger);
            idxDuplicate = idx;
        }
    });
    if (duplicate) {
        if (!confirm(`${JSON.stringify(newTrigger)} is a duplicate to 
                Trigger #${idxDuplicate}; OK?`))
            return;
    }
    if (changed) {
        tc.triggerlist[recIndex] = newTrigger;
    } // else remake table to removestatus flags (good/bad)
    makeTriggerTable(tc.triggerlist);
}

function triggerAdd() {
    var record = $(this).parent();
    var newTrigger = makeTriggerObject(record);
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    var existingTrigger = tc.triggerlist.find(t => equalTrigger(t, newTrigger));
    if (existingTrigger) {
        if (!confirm(`This Trigger is a duplicate`)) return;
    } else {
        tc.triggerlist.push(newTrigger);
    }
    makeTriggerTable(tc.triggerlist);
    $('.error').empty();
}

function triggerDelete() {
    var record = $(this).parent();
    var recIndex = record.attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    $('.error').empty();

    if (confirm(`Delete Trigger ${recIndex}?`)) {
        tc.triggerlist.splice(recIndex, 1);
        makeTriggerTable(tc.triggerlist);
    }
}

function searchTriggersforScene(scene, cb) {
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    tc.triggerlist.forEach((t, idx) => {
        let id = t.ScenelID; // 
        if (id == scene)
            cb(idx);
    });
}

function searchTriggersforSwitch(swtch, cb) {
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    tc.triggerlist.forEach((t, idx) => {
        let id = t.IPtrigger.swPlate; // 
        if (id == swtch)
            cb(idx);
        id = t.IPstate1.swPlate; // 
        if (id == swtch)
            cb(idx);
    });
}

function updateAllTriggerSwitchs(oldSwitchID, newSwitchID, triggerlist) {
    triggerlist.forEach(s => {
        if (s.IPtrigger.swPlate == oldSwitchID) {
            s.IPtrigger.swPlate = newSwitchID;
        }
        if (s.IPstate1.swPlate == oldSwitchID) {
            s.IPstate1.swPlate = newSwitchID;
        }
    });
}

/* #endregion */

// ***************************Sub-Section edits
function subSectionChanged(event) {
    if (tlc == 'none') {
        $('.error').html('TLc not selected');
        $(this).val('none')
        return;
    }
    $('.error').empty();
    var t = tlcConfig.find(t => t.Name == tlc);
    if (!t) { // 'none' ?
        $('#subSection').empty();
        return;
    }
    var subSection = this.value;
    let names = [];
    switch (subSection) {
        case 'none':
            $('#subSectionData').empty();
            break;
        case 'Channels':
            switch ($('#section').val()) {
                case 'Area':
                    let selectedArea = $('#sectionData .selected .areaID').val();
                    if (t.config) {
                        if (!t.config.channellist) names.push({ name: 'channels', list: 'channellist' });
                        if (!t.config.scenechannellist) names.push({ name: 'scenechannels', list: 'scenechannellist' });
                        var promises = names.map(item => getList(item.name).then((y) => y));
                        Promise.all(promises).then(results => {
                            results.forEach((r, idx) => t.config[names[idx].list] = r.info);
                            makeChannelTable(t.config.channellist, selectedArea);
                        })
                            .catch(err => $('.error').html(`Downloading Error ${JSON.stringify(err)}`));
                    }
                    break;
                case 'Scene':
                    let selectedScene = $('#sectionData .selected .sceneID').val();
                    if (t.config) {

                        if (!t.config.scenechannellist) names.push({ name: 'scenechannels', list: 'scenechannellist' });
                        if (!t.config.channellist) names.push({ name: 'channels', list: 'channellist' });
                        if (!t.config.scenelist) names.push({ name: 'scenes', list: 'scenelist' });
                        let promises = names.map(item => getList(item.name).then((y) => y));
                        Promise.all(promises).then(results => {
                            results.forEach((r, idx) => t.config[names[idx].list] = r.info);
                            makeSceneChannelTable(t.config.scenechannellist, selectedScene);
                            $('.error').empty();
                        })
                            .catch(err => $('.error').html(`Downloading Error ${JSON.stringify(err)}`));
                    }
                    break;
                default:
                    $('#subSection').empty();
                    return;
            }
            break;
        case 'Switches':
            switch ($('#section').val()) {
                case 'Area':
                    let selectedArea = $('#sectionData .selected .areaID').val();
                    if (t.config) {
                        if (!t.config.arealist) names.push({ name: 'areas', list: 'arealist' });
                        if (!t.config.switchplatelist) names.push({ name: 'switchplates', list: 'switchplatelist' });
                        if (!t.config.triggerlist) names.push({ name: 'triggers', list: 'triggerlist' });
                        var promises = names.map(item => getList(item.name).then((y) => y));
                        Promise.all(promises).then(results => {
                            results.forEach((r, idx) => t.config[names[idx].list] = r.info);
                            makeSwitchTable(t.config.switchplatelist, selectedArea);
                        });
                    }
                    break;
                default:
                    $('#subSection').empty();
                    return;
            }
            break;
    }
}

/* #region  (Area) Channels */
function makeChannelTable(channelslist, selectedArea) {
    var idx = 0;
    var str = '<h3 style="width: 100%">Channels<button class="help"> ? </button></h3>';
    channelslist.forEach(channel => {
        let display = (!selectedArea || selectedArea == channel.AreaID) ?
            '' : ' hideRec'; // Hide       
        str += `<div class="ipFields${display}" idx="${idx}">`;
        str += addInput('ID', 'channelID' + idx, 'channelID',
            channel.ID, numberPattern, `0-${MAXCHANNEL}-1`);
        str += addInput('Name', 'channelName' + idx, 'channelName',
            channel.Name, namePattern, `Up to ${MAXNAME} name characters`);
        str += addAreaSpin('AreaID', 'channelAreaID' + idx, 'channelAreaID',
            channel.AreaID, numberPattern, `0-${MAXAREA - 1}`);
        str += '<button class="channelAction">Update</button>';
        str += '<button class="channelDelete">Delete</button>';
        str += '</div>';
        idx++;
    });
    if (channelslist.length < MAXCHANNEL) {
        str += '<div class="ipFields">';
        str += addInput('ID', 'channelID-new', 'channelID',
            "", numberPattern, `0-${MAXCHANNEL}-1`);
        str += addInput('Name', 'channelName-new', 'channelName',
            "", namePattern, `Up to ${MAXNAME - 1} name characters`);
        str += addAreaSpin('AreaID', 'channelAreaID-new', 'channelAreaID',
            selectedArea, numberPattern, `0-${MAXAREA - 1}`);
        str += '<button class="channelAdd">Add</button>';
        str += '</div>';
    } else {
        $('.error').html(`Reached max Areas (${MAXCHANNEL})`)
    }
    $('#subSectionData').html(str);
    $('.channelName').css('width', '8em');
    $('.channelID').css('width', '1em');
    $('.channelAreaID').css('width', '8em');
    $('.channelAction').on('click', channelAction);
    $('.channelAdd').on('click', channelAdd);
    $('.channelDelete').on('click', channelDelete);
    updateValidation('#subSectionData.ipFields');
    $('button.help').on('click', showHelp);
}

function checkAreaID(areaID, tc) {
    if (tc.arealist) {
        if (!tc.arealist.find(a => a.ID == areaID)) {
            $('.error').html(`Area ID ${areaID} not found`);
            return false;
        }
        $('.error').empty();
    } else {
        return false;
    }
    return true;
}

function channelAction() {
    var record = $(this).parent();
    if (!checkFieldStatus(record)) return;
    var newChannel = {
        ID: record.find("input.channelID").val(),
        AreaID: parseInt(record.find("select.channelAreaID").val()),
        Name: record.find("input.channelName").val()
    };
    var recIndex = record.attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    let duplicate = false;
    let duplicateChannel = 0;
    let changed;
    var oldChannel = {};
    tc.channellist.forEach((c, idx) => {
        if (idx == recIndex) {
            changed = (c.ID != newChannel.ID); // true => channelID has changed 
            if (changed) oldChannel = { ...c };
        } else {
            if (c.ID == newChannel.ID) {
                duplicate = true;
                duplicateChannel = c.ID;
            }
        }
    });
    if (duplicate) {
        $('.error').text(`${JSON.stringify(newChannel)} is a duplicate of channel ${duplicateChannel}`);
        return;
    }
    $('.error').empty();
    let updateOK = false;
    if (changed) {
        searchChannelUsage(oldChannel.ID, (channelList, sceneList) => {
            if (channelList.length == 0) return;
            if (!confirm(`Scenes[${sceneList}]-Channels[${channelList}]  need updating; OK?`)) return;
            updateAllChannelScenesChannels(oldChannel.ID, newChannel.ID, tc.scenechannellist);
            updateOK = true;
        });
        if (updateOK) {
            tc.channellist[recIndex] = newChannel;
            makeChannelTable(tc.channellist);
        }
    } else {
        tc.channellist[recIndex] = newChannel;
        makeChannelTable(tc.channellist);
    }
}

function channelAdd() {
    var id = $(this).parent().find("input.channelID").val();
    var name = $(this).parent().find("input.channelName").val();
    var areaID = parseInt($(this).parent().find("select.channelAreaID").val());
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    if (!checkAreaID(areaID, tc)) return;
    var existingID = tc.channellist.find(c => c.ID == id);
    if (!existingID && id && name && areaID) {
        tc.channellist.push({
            ID: id,
            Name: name,
            AreaID: areaID
        });
        makeChannelTable(tc.channellist);
        $('.error').empty();
    } else {
        $('.error').html('Problem');
    }
}

function channelDelete() {
    var record = $(this).parent();
    var channelID = record.find("input.channelID").val();
    var recIndex = record.attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    let updateOK = false;
    searchChannelUsage(channelID, (channelList, sceneList) => {
        if (channelList.length == 0) { updateOK = true; return; }
        $('.error').html(`Scenes[${sceneList}]-Channels[${channelList}] need updating`);
    });
    if (updateOK) {
        if (confirm(`Delete Channel ${channelID}?`)) {
            tc.channellist.splice(recIndex, 1);
            makeChannelTable(tc.channellist);
        }
    }
}

function getChannelsHelp() {
    let str = '';

    str += '<p><i>Channels</i> ID directly correspond to the DMX channels controlled by the TLc.</p>';
    str += '<p>Each <i>Channels</i> must be configured to "belong" to an <i>Area</i>.</p>';
    return str;
}

function searchChannelUsage(channel, cb) { // NB Need both channel and scene to identify a record
    var channelList = [];
    var sceneList = [];
    searchSceneChannelsforChannel(channel, (c, s) => {
        channelList.push(c);
        sceneList.push(s);
    });
    if (cb) cb(channelList, sceneList);
}

function updateAllChannelAreas(oldAreaID, newAreaID, channellist, arealist) {
    channellist.forEach(c => {
        if (c.AreaID == oldAreaID) {
            c.AreaID = newAreaID;
            c.Area = arealist.find(a => a.ID == newAreaID);
        }
    });
}

function searchChannelsforArea(area, cb) {
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    tc.channellist.forEach(c => { let id = c.AreaID; if (id == area) cb(c.ID) });
}
/* #endregion */

/* #region  (Area) Switches */
function makeSwitchTable(switchplatelist, selectedArea) {
    var idx = 0;
    var str = '<h3 id="switchplates" style="width: 100%">Switches<button class="help"> ? </button></h3>';
    switchplatelist.forEach(swtch => {
        let display = (!selectedArea || selectedArea == swtch.AreaID) ?
            '' : ' hideRec'; // Hide
        str += `<div class="ipFields ${display}" idx="${idx}">`;
        str += addInput('ID', 'swtchID' + swtch.ID, 'swtchID',
            swtch.ID, numberPattern, `0-${MAXSWITCHPLATE - 1}`);
        str += addAreaSpin('AreaID', 'swtchAreaID' + swtch.ID, 'swtchAreaID',
            swtch.AreaID, numberPattern, `0-${MAXAREA - 1}`);
        str += addInput('Name', 'swtchName' + swtch.ID, 'swtchName',
            swtch.Name, namePattern, `Up to ${MAXNAME - 1} name characters`);
        str += '<fieldset>';
        str += `<div id="swSlider${idx}" class="swSlider"></div>`;
        str += addInput('LDR Light', 'LDRlevelLow' + swtch.ID, 'LDRlevelLow',
            swtch.LDRlevelLow, numberPattern, "0-255");
        str += addInput('LDR Dark', 'LDRlevelHigh' + swtch.ID, 'LDRlevelHigh',
            swtch.LDRlevelHigh, numberPattern, "0-255");
        str += '</fieldset>';
        str += '<button class="switchAction">Update</button>';
        str += '<button class="switchDelete">Delete</button>';
        str += '</div>';
        idx++;
    });
    if (switchplatelist.length < MAXSWITCHPLATE) {
        str += '<div class="ipFields">';
        str += addInput('ID', 'swtchID-new', 'swtchID',
            "", numberPattern, `0-${MAXSWITCHPLATE - 1}`);
        str += addInput('AreaID', 'swtchAreaID-new', 'swtchAreaID',
            selectedArea, numberPattern, `0-${MAXAREA - 1}`);
        str += addInput('Name', 'swtchName-new', 'swtchName',
            "", namePattern, `Up to ${MAXNAME - 1} name characters`);
        str += '<fieldset>';
        str += addInput('LDR Light', 'LDRlevelLow-new', 'LDRlevelLow',
            0, numberPattern, "0-255");
        str += addInput('LDR Dark', 'LDRlevelHigh-new', 'LDRlevelHigh',
            0, numberPattern, "0-255");
        str += '</fieldset>';
        str += '<button class="switchAdd">Add</button>';
        str += '</div>';
    } else {
        $('.error').html(`Reached max Areas (${MAXSWITCHPLATE})`)
    }
    $('#subSectionData').html(str);
    $('.swtchName,.swtchAreaID').css('width', '8em')
    $('.LDRlevelHigh,.LDRlevelLow,.FadePrev').css('width', '2.5em')
    $('.swtchID').css('width', '1.5em')
    $('.switchAction').on('click', switchAction);
    $('.switchDelete').on('click', switchDelete);
    $('.switchAdd').on('click', switchAdd);
    updateValidation('#subSectionData.ipFields');
    $('button.help').on('click', showHelp);
    $("#subSectionData.ipFields .swSlider").slider({
        range: true,
        min: 0,
        max: 255
    });
    $('#subSectionData.ipFields .swSlider').each((idx, item) => {
        var fldSet = $(item).parent();
        var hi = $(fldSet).find('.LDRlevelHigh').val();
        var lo = $(fldSet).find('.LDRlevelLow').val();
        $(item).slider('values', [lo, hi]);
        $(item).on('slidechange', (ev, item) => {
            var fldSet = $(ev.currentTarget.parentNode);
            let hi =  $(fldSet).find('.LDRlevelHigh');
            let lo = $(fldSet).find('.LDRlevelLow');
            hi.val(item.values[1]);
            setValidationClass(true, hi);
            lo.val(item.values[0]);
            setValidationClass(true, lo);
        });
    });
}

function switchAction(data) {
    var record = $(this).parent();
    if (!checkFieldStatus(record)) return;
    var newSwitch = {
        ID: $(this).parent().find("input.swtchID").val(),
        Name: $(this).parent().find("input.swtchName").val(),
        AreaID: parseInt($(this).parent().find("select.swtchAreaID").val()),
        LDRlevelHigh: $(this).parent().find("input.LDRlevelHigh").val(),
        LDRlevelLow: $(this).parent().find("input.LDRlevelLow").val()
    };
    var recIndex = $(this).parent().attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    let duplicate = false;
    let duplicateSwitch = 0;
    let changedID;
    var oldSwitch = {};
    tc.switchplatelist.forEach((sw, idx) => {
        if (idx == recIndex) {
            changedID = (sw.ID != newSwitch.ID); // true => switchID has changed 
            if (changedID) oldSwitch = { ...sw };
        } else {
            if (sw.ID == newSwitch.ID) {
                duplicate = true;
                duplicateSwitch = sw.ID;
            }
        }
    });
    if (duplicate) {
        $('.error').text(`${JSON.stringify(newSwitch)} is a duplicate of switch ${duplicateSwitch}`);
        return;
    }
    $('.error').empty();
    let updateOK = false;
    if (changedID) {
        searchSwitchUsage(oldSwitch.ID, (triggerList) => {
            if (triggerList.length == 0) return;
            if (!confirm(`Triggers[${triggerList}]  need updating; OK?`)) return;
            updateAllTriggerSwitchs(oldSwitch.ID, newSwitch.ID, tc.triggerlist);
            updateOK = true;
        });
        if (updateOK) {
            tc.switchplatelist[recIndex] = newSwitch;
            makeSwitchTable(tc.switchplatelist);
        }
    } else { // No need to check for references to switch.ID
        tc.switchplatelist[recIndex] = newSwitch;
        makeSwitchTable(tc.switchplatelist);
    }
}

function switchAdd(data) {
    var id = $(this).parent().find("input.swtchID").val();
    var name = $(this).parent().find("input.swtchName").val();
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    var existingID = tc.switchplatelist.find(a => a.ID == id);
    if (!existingID && id && name) {
        tc.switchplatelist.push({
            ID: id, Name: name,
            FadeIn: 0, Duration: 0, FadeOut: 0,
            Nextswtch: 255, StartTime: "42:30", FadePrev: false
        });
        makeSwitchTable(tc.switchplatelist);
        $('.error').empty();
    } else {
        $('.error').html('Problem');
    }
}

function switchDelete() {
    var record = $(this).parent();
    var swtchID = record.find("input.swtchID").val();
    var recIndex = record.attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    if (confirm(`Delete Switch ${swtchID}?`)) {
        tc.switchplatelist.splice(recIndex, 1);
        makeSwitchTable(tc.switchplatelist);
    }
}

function getSwitchplatesHelp() {
    let str = '';

    str += '<p><i>Switches</i> directly correspond to the switchplates  connected to the TLc.</p>';
    str += '<p>Each <i>Switch</i> ID relates to the addresss configured in the switchplates \
            and should be configured to "belong" to an <i>Area</i>.</p>';
    str += '<p>The LDR levels are used by those switchplates that have a light sensor.\
            The table shows the <i>Trigger</i> type (action) given a light level reading.</p>';
    str += '<table><tbody>\
            <tr><td>New level -></td><td>Very Dark<br>LDR &gt; Dark Level</td>\
                <td>Dark<br>LDR between Dark and Light level</td>\
                <td>VeryLight<br>LDR &lt; Light level</td></tr>\
            <tr><td>Very Dark</td><td>-</td><td>Dark</td><td>VeryLight</td></tr>\
            <tr><td>Dark</td><td>Very Dark</td><td>-</td><td>VeryLight</td></tr>\
            <tr><td>Light</td><td>Very Dark</td><td>-</td><td>VeryLight</td></tr>\
            <tr><td>Very Light</td><td>Very Dark</td><td>Light</td><td>-</td></tr>\
            </tbody></table>'
    return str;
}

function searchSwitchUsage(swtch, cb) { // NB Need both switch and scene to identify a record
    var triggerList = [];
    searchTriggersforSwitch(swtch, (c, s) => {
        triggerList.push(c);
    });
    if (cb) cb(triggerList);
}

function searchSwitchesforArea(area, cb) {
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    tc.switchplatelist.forEach(c => { let id = c.AreaID; if (id == area) cb(c.ID) });
}

function updateAllSwitchPlateAreas(oldAreaID, newAreaID, switchplatelist) {
    switchplatelist.forEach(s => {
        if (s.AreaID == oldAreaID) {
            s.AreaID = newAreaID;
        }
    });
}
/* #endregion */

/* #region  (Scene) Channels */
function showSlider() {
    var p = $(this).parent().parent();
    let currentValue = $(p).find('.ChannelValue').val();
    let str = '<div id="sliderDiv" class="sliderDiv">';
    str += '<p>Channel Setting <button id="sliderDone">Done</button></p>';
    str += `<input type="range" id="slider" min="0" max="255" value="${currentValue}">`;
    str += '</div>';
    $(p).append(str);
    let boundingID = $(p).attr('id');
    $('#sliderDiv').position({
        my: "top left",
        at: "left bottom",
        of: `#${boundingID}`
    });
    $('#sliderDone').on('click', closeSlider);
    $('#slider').on('change', updateChannelValue);
    return false;
}

function closeSlider() {
    $('#sliderDiv').remove();
}

function updateChannelValue() {
    let val = $(this).val();
    let x = $(this).parent().parent().find('.ChannelValue').val(val);
    // TODO Send update channel value message
}

function sceneChannelDelete() {
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    var recIndex = $(this).parent().attr("idx");
    var tsc = tc.scenechannellist[recIndex];
    if (confirm(`Delete Scene${tsc.SceneID}/  Channel ${tsc.Channel.ID} - ${tsc.Channel.Max}?`)) {
        let selectedScene = $('#sectionData .selected .sceneID').val();
        tc.scenechannellist.splice(recIndex, 1);
        makeSceneChannelTable(tc.scenechannellist, selectedScene);
    }
}

function makeSceneChannelTable(scenechannelslist, selectedScene) {
    var idx = 0;
    var str = '<h3 style="width: 100%">Scene Channels<button class="help"> ? </button></h3>';
    scenechannelslist.forEach(channel => {
        let display = (!selectedScene || selectedScene == channel.SceneID) ?
            '' : ' hideRec'; // Hide
        str += `<div class="ipFields${display}" idx="${idx}" id="channelScene${idx}">`;
        str += addSceneSpin('SceneID', 'channelSceneID' + idx, 'channelSceneID',
            channel.SceneID, numberPattern, `0-${MAXSCENE - 1}`);
        str += addInput('ChannelValue', 'ChannelValue' + idx, 'ChannelValue',
            channel.Channel.value, numberPattern, `0-255`);
        str += '<fieldset>';
        str += addChannelSpin('ChannelID', 'ChannelStartID' + idx, 'ChannelStartID',
            channel.Channel.ID, namePattern, `0 to ${MAXCHANNEL - 1}`);
        str += addChannelSpin('-', 'ChannelMaxID' + idx, 'ChannelMaxID',
            channel.Channel.Max, numberPattern, `0-${MAXCHANNEL - 1}`);
        str += '</fieldset>';
        str += '<button class="sceneChannelAction">Update</button>';
        str += '<button class="sceneChannelDelete">Delete</button>';
        str += '</div>';
        idx++;
    });
    if (scenechannelslist.length < MAXSCENECHANNEL) {
        str += '<div class="ipFields">';
        str += addSceneSpin('SceneID', 'channelSceneID-new', 'channelSceneID',
            0, numberPattern, `0-${MAXSCENE - 1}`);
        str += addInput('ChannelValue', 'ChannelValue-new', 'ChannelValue',
            255, numberPattern, `0-255`);
        str += '<fieldset>';
        str += addChannelSpin('ChannelID', 'ChannelStartID-new', 'ChannelStartID',
            0, namePattern, `0 to ${MAXCHANNEL - 1}`);
        str += addChannelSpin('-', 'ChannelMaxID-new', 'ChannelMaxID',
            0, numberPattern, `0-${MAXCHANNEL - 1}`);
        str += '</fieldset>';
        str += '<button class="sceneChannelAdd">Add</button>';
        str += '</div>';
    } else {
        $('.error').html(`Reached max Scene-Channels (${MAXSCENECHANNEL})`)
    }
    $('#subSectionData').html(str);
    $('.ChannelStartID,.channelSceneID,.ChannelMaxID').css('width', '8em');
    $('.ChannelValue').css('width', '2em');
    $('.ChannelValue').on('contextmenu', showSlider);
    $('.sceneChannelAction').on('click', sceneChannelAction);
    $('.sceneChannelDelete').on('click', sceneChannelDelete);
    $('.sceneChannelAdd').on('click', sceneChannelAdd);
    updateValidation('#subSectionData.ipFields');
    $('button.help').on('click', showHelp);
}

function checkSceneID(sceneID, tc) {
    if (tc.scenelist) {
        if (!tc.scenelist.find(s => s.ID == sceneID)) {
            $('.error').html(`Scene ID ${sceneID} not found`);
            return false;
        }
        $('.error').empty();
    } else {
        $('.error').html(`SceneList is not loaded`);
        return false;
    }
    return true;
}

function sceneChannelAction() {
    var record = $(this).parent();
    if (!checkFieldStatus(record)) return;
    var newChannelScene = {
        SceneID: parseInt(record.find("select.channelSceneID").val()),
        Channel: {
            value: record.find("input.ChannelValue").val(),
            ID: record.find("select.ChannelStartID").val(),
            Max: record.find("select.ChannelMaxID").val()
        }
    };
    var recIndex = parseInt(record.attr("idx"));
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;

    if (checkSceneID(newChannelScene.SceneID, tc)) {
        tc.scenechannellist[recIndex] = newChannelScene;
        makeSceneChannelTable(tc.scenechannellist);
    }
}

function sceneChannelAdd() {
    var record = $(this).parent();
    var newChannelScene = {
        SceneID: parseInt(record.find("select.channelSceneID").val()),
        Channel: {
            value: record.find("input.ChannelValue").val(),
            ID: record.find("select.ChannelStartID").val(),
            Max: record.find("select.ChannelMaxID").val()
        }
    };
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    if (!checkSceneID(newChannelScene.SceneID, tc)) return;
    // TODO check for similar record
    var existingID = tc.scenehannellist.find(c => c.ID == id);
    if (!existingID && id && name && sceneID) {
        tc.scenehannellist.push(newChannelScene);
        makeSceneChannelTable(tc.scenehannellist);
        $('.error').empty();
    } else {
        $('.error').html('Problem');
    }
}

function getSceneChannelsHelp() {
    let str = '';

    str += `<p>This is a list of <i>Channels</i> that make up a <i>Scene</i>.\ 
            Note that these records are only shown when <i>Scenes</i> are selected \
            in the left hand (Section) panel.</p>`;
    str += `<p>The light level for the channel (or range of Chanels) is set \
            by entering a value of 0-255 in the Channel Value field. \
            Alternatively right-clicking the field brings up a slider to set the value.</p>`
    str += `<p>If a number of consecutive channels are to be set to the same value \
            enter a higher channel number in the 2nd Channel ID field.</p>`
    return str;
}

function searchSceneChannelsforScene(scene, cb) {
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    tc.scenechannellist.forEach(sc => {
        let id = sc.SceneID; // Otherwise sc.SceneID is  undefined ????
        if (id == scene)
            cb(sc.Channel.ID);
    });
}

function searchSceneChannelsforChannel(channel, cb) {
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    tc.scenechannellist.forEach(sc => {
        let id = sc.Channel.ID;
        if (id == channel) cb(sc.Channel.ID, sc.SceneID);
        id = sc.Channel.Max;
        if (id == channel) cb(sc.Channel.Max, sc.SceneID);
    });
    // TODO Problem with changing channel range
}

function updateAllChannelScenesChannels(oldChannelID, newChannelID, scenechannelList) {
    scenechannelList.forEach(c => {
        if (c.Channel.ID == oldChannelID) {
            c.Channel.ID = newChannelID;
        }
        if (c.Channel.Max == oldChannelID) {
            c.Channel.Max = newChannelID;
        }
    });
}
/* #endregion */
