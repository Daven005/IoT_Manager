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
    {name: 'system', list: 'sysinfo'},
    {name: 'areas', list: 'arealist'},
    {name: 'scenes', list: 'scenelist'},
    {name: 'channels', list: 'channellist'},
    {name: 'switchplates', list: 'switchplatelist'},
    {name: 'triggers', list: 'triggerlist'},
    {name: 'scenechannels', list: 'scenchannellist'}
];

var tlc = 'none';

$(function () {
    $("#tlc").on('change', tlcChanged);
    $("#section").on('change', sectionChanged);
    $("#subSection").on('change', subSectionChanged);
    $('#save').click(saveConfig);
    $('#read').click(readConfig);
    $('#delete').click(deleteConfig);
    $('#upload').click(uploadConfig);
    $('#download').click(downloadConfig);
    makeReadList();
});

// *********************************General

function makeReadList() {
    var items = Object.keys(localStorage);
    $('#readList').empty();
    items.forEach(item => $('#readList').append(`<option value="${item}">${item}</option>`))
}

function updateValidation() {
    $("input[pattern]").blur(function () {
        var elem = $(this);
        var pattern = new RegExp(elem.attr("pattern"));
        if (pattern.test(elem.val())) { // NB don't use switchClass due to easing causing a delay
            elem.addClass('good');
            elem.removeClass('bad');
        } else {
            elem.addClass('bad');
            elem.removeClass('good');
        }
    });
}

function getSection(name, cb) {
    $.getJSON(`http://${t.IPaddress}:9073/${name}?serialNo=${t.serNo}&callback=?`)
        .then(d => cb(d))
        .fail(function (jqxhr, textStatus, error) {
            $('.error').html(`Can't get ${name}`);
            console.log(`Request for ${name} Failed: ${textStatus}, ${err}`);
        });
}

function getList(name) {
    $('.error').html(`${name} loading`);
    let x = $.getJSON(`http://${t.IPaddress}:9073/${name}?serialNo=${t.serNo}&callback=?`);
    return x;
}

function addInput(label, id, fieldName, value, pattern, title) {
    let str = `<label style="margin-left: 5px;">${label}: `;
    str += `<input type="text" class="${fieldName}" name="${fieldName}" id="${id}" `;
    str += `value="${value}"`;
    if (pattern) str += ` pattern="${pattern}"`;
    if (title) str += ` title="${title}"`;
    str += `></label>`;
    return str;
}

function addSceneSpin(label, id, fieldName, value, pattern, title) {
    return addSpin('scenelist', -1, label, id, fieldName, (value==255) ? -1:value, title);
 }

function addAreaSpin(label, id, fieldName, value, pattern, title) {
    return addSpin('arealist', -1, label, id, fieldName, (value==255) ? -1:value, title);
}

function addChannelSpin(label, id, fieldName, value, pattern, title) {
    
    return addSpin('channellist', -1, label, id, fieldName, (value==255) ? -1:value, title);
}

function addSwitchPlateSpin(label, id, fieldName, value, pattern, title) {
    return addSpin('switchplatelist', -1, label, id, fieldName, (value==255) ? -1:value, title);
}

function addSwitchButtonSpin(label, id, fieldName, value, pattern, title) {
    let str = `<label style="margin-left: 5px;">${label}: `;
    str += `<select class="${fieldName}" name="${fieldName}" id="${id}" `;
    if (title) str += ` title="${title}"`;
    str += `>`;
    let idx = 0;
    for (idx=0; idx <8; idx++) {
        str += `<option value="${idx}" ${(idx==value)?' selected': undefined}>${idx}: SW${idx+1}</option>`;
    };
    str += `<option value="${idx++}" ${(idx==value)?' selected': undefined}>${idx}: PIR</option>`
    str += `<option value="${idx++}" ${(idx==value)?' selected': undefined}>${idx}: Day/Night</option>`
    str += `<option value="15" ${(15==value)?' selected': undefined}>15: none</option>`
    str += '</select></label>';
    return str;
}

function addSwitchButtonActionSpin(label, id, fieldName, value, pattern, title) {
    let str = `<label style="margin-left: 5px;">${label}: `;
    str += `<select class="${fieldName}" name="${fieldName}" id="${id}" `;
    if (title) str += ` title="${title}"`;
    str += `>`;
    let idx = 0;
    str += `<option value="${idx++}" ${(idx==value)?' selected': undefined}>${idx}: Pressed</option>`
    str += `<option value="${idx++}" ${(idx==value)?' selected': undefined}>${idx}: Released Fast</option>`
    str += `<option value="${idx++}" ${(idx==value)?' selected': undefined}>${idx}: Released Any</option>`
    str += `<option value="${idx++}" ${(idx==value)?' selected': undefined}>${idx}: Pressed and Held</option>`
    str += '</select></label>';
    return str;
}

function addSpin(list, defaultOption, label, id, fieldName, value, title) {
    let str = `<label style="margin-left: 5px;">${label}: `;
    str += `<select class="${fieldName}" name="${fieldName}" id="${id}" `;
    if (title) str += ` title="${title}"`;
    str += `>`;
    if (defaultOption) {
        str += `<option value="${defaultOption}" ${(defaultOption == value) ? ' selected' : undefined}>${defaultOption}: none</option>`;
    }
    t = tlcConfig.find(t => t.Name == tlc);
    // console.log(Array.isArray(t.config[list]))
    // let array = t.config[list].map(a => a);
    $(t.config[list]).each((idx, a) => {
        str += `<option value="${a.ID}" ${(a.ID==value)?' selected': undefined}>${a.ID}: ${a.Name}</option>`;
    });  
    str += '</select></label>';
    return str;
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
    var badCount = record.find('input.bad').length;
    var goodCount = record.find('input.good').length;
    if (badCount > 0) {
        $('.error').html('Correct bad fields first');
        return false;
    }
    if (goodCount == 0) return false; // Nothing changed
    return true;
}

function readConfig() {
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t || !t.config) {
        $('.error').html('First select a TLc'); 
        return;
    }
    let v = $('#readList').val();
    if (v) {
        try {
            config = JSON.parse(localStorage.getItem(v));
            let tlcName = config.sysinfo.Name;
            if (tlc != tlcName) {
                $('.error').html(`File "${v}" contains info for "${tlcName}" not selected "${tlc}"`);
                return;
            }
            t.config = config;
        } catch (ex) {
            $('.error').html(`${v} is corrupt`);
        }
    } else {
        $('.error').html('Select an entry');
    }
}

function saveConfig() {
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t || !t.config || !t.config.meta) {$('.error').html('Select a TLc'); return;}
    let fileName = t.config.meta.Version;

    let listStr = '';
    if (!t.config.arealist) str += 'arealist, ';
    if (!t.config.scenelist) str += 'scenelist, ';
    if (!t.config.switchplatelist) str += 'switchplatelist, ';
    if (!t.config.channellist) str += 'channellist, ';
    if (!t.config.scenechannellist) str += 'scenechannellist, ';
    if (!t.config.triggerlist) str += 'triggerlist, ';
    if (str != '') {
        if (!confirm(`${str} are missing. OK?`)) return;
    }
    localStorage.setItem(fileName, JSON.stringify(t.config));
    makeReadList();
}

function deleteConfig() {
    let v = $('#readList').val();
    if (v) {
        if (confirm(`Delete ${v}`)) {
            localStorage.removeItem(v);
            makeReadList();
        }
    } else {
        $('.error').html('Select an entry'); 
    }
}

function uploadConfig() {

}

function downloadConfig() {
    var promises = allSections.map(item => getList(item.name).then((y) => y));
    Promise.all(promises).then(results => {
        results.forEach((r, idx) => t.config[allSections[idx].list] = r.info);
    });
}

function showHelp() {
    let helpStr;
    switch ($(this).parent().attr('id')) {
        case 'triggers': helpStr = getTriggersHelp(); break;;
        case 'areas':
        case 'scenes':
        case 'switchplates':
            break;
    }
    var p = $(this).parent();
    let str = '<div id="helpDiv" class="helpDiv">';
    str += '<p><h4>Help</h4> <button class="helpDone">X</button></p>';
    str += helpStr;
    str += '</div>';
    $(p).append(str);
    let boundingID = $(p).attr('id');
    $('#helpDiv').position(str = {
        my: "top left",
        at: "bottom left",
        of: `#${boundingID}`
      });
    $('.helpDone').click(closeHelp);
    return false;
}

function closeHelp() {
    $('#helpDiv').remove();
}

// ***************************TLc edits
function getMeta(cb) {
    url = `/tlcEdit/getMeta?tlc=${t.Name}`; // Needs to be done via host
    $.getJSON(url, cb)
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        });
}

function tlcChanged(event) {
    tlc = this.value;
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t) { // 'none' ?
        $('#system').empty();
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

// *****************System
function updateSystem(data) {
    makeSystemTable(data.info);
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t.config) t.config = {};
    t.config.sysinfo = data.info;
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
    $("#systemAction").click(systemAction);
    updateValidation();
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

// *****************Meta
function updateMeta(data) {
    var m = data.find((m) => m.meta.Type == "Config");
    makeMetaTable(m.meta);
    t = tlcConfig.find(t => t.Name == tlc);
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
    $("#metaAction").click(metaAction);
    updateValidation();
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
    if (goodCount == 0) return; // Nothing changed
    tc.meta = {
        Type: 'Config',
        Version: record.find('.metaVersion').val(),
        File: record.find('.metaFile').val()
    };
    record.find('input.good').removeClass('good');
}

// ***************************Section edits
function sectionChanged(event) {
    if (tlc == 'none') {
        $('.error').html('TLc not selected');
        $(this).val('none')
        return;
    }
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t) { // 'none' ?
        $('#section').empty();
        return;
    }

    var section = this.value;
    $('#subSection').val('none');
    $('#subSectionData').empty();
    switch (section) {
        case 'none':
            $('#sectionData').empty();
            $('#dataSections').removeAttr('colspan');
            $('#dataSubSections').show();
            break;
        case "Area":
            if (t.config) {
                if (t.config.arealist) {
                    makeAreaTable(t.config.arealist);
                } else {
                    getSection('areas', updateArea);
                }
            }
            $("#subSection option").removeAttr("disabled"); // Channels and Switches enabled
            $('#dataSections').removeAttr('colspan');
            $('#dataSubSections').show();
            break;
        case "Scene":
            if (t.config) {
                if (t.config.scenelist) {
                    makeSceneTable(t.config.scenelist);
                } else {
                    getSection('scenes', updateScene);
                }
            }
            $("#subSection option").removeAttr("disabled"); // Switches disabled
            $("#subSection option[value='Switches']").attr("disabled", "disabled");
            $('#dataSections').removeAttr('colspan');
            $('#dataSubSections').show();
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
                    $('.error').empty();
                })
                .catch(err => $('.error').html(`Downloading Error ${err}`));
            }
            break;
    }
}

// *****************Area
function checkSelectedArea() {
    let selectedAreaID;
    if (selectRecord(this)) {
        selectedAreaID = $(this).find('input').val();
    } // else undefined
    t = tlcConfig.find(t => t.Name == tlc);
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

function updateArea(data) {
    makeAreaTable(data.info);
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t.config) t.config = {};
    t.config.arealist = data.info;
}

function makeAreaTable(arealist) {
    var idx = 0;
    var str = '<h3 style="width: 100%">Areas</h3>';
    arealist.forEach(area => {
        str += `<div class="ipFields" idx="${idx}">`;
        str += addInput('ID', 'areaID' + area.ID, 'areaID',
            area.ID, numberPattern, "0-9");
        str += addInput('Name', 'areaName' + area.ID, 'areaName',
            area.Name, namePattern, 'Up to 15 name characters');
        str += '<button class="areaAction">Update</button>';
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
    $('#sectionData').html(str);
    $('.areaName').css('width', '10em');
    $('.areaID').css('width', '1em');
    $('.areaAction').click(areaAction);
    $('.areaAdd').click(areaAdd);
    updateValidation();
    $('div#sectionData.ipFields div').click(checkSelectedArea);
}

function areaAction(data) {
    var record = $(this).parent();
    if (!checkFieldStatus(record)) return;
    var areaID = record.find("input.areaID").val();
    var areaName = record.find("input.areaName").val();
    var recIndex = record.attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    let matchCount = -1; // Default to 'ID has not changed'

    if (areaID == '') { // Delete area
        if (confirm(`Delete area ${tc.arealist[recIndex].ID}/${tc.arealist[recIndex].Name}?`)) {
            tc.arealist.splice(recIndex, 1);
            makeAreaTable(tc.arealist);
        }
        return;
    }
    for (idx = 0; idx < tc.arealist.length; idx++) {
        if (idx == recIndex) {
            if (tc.arealist[idx].ID != areaID) { // ID has changed
                matchCount = 0;
            }
        } else {
            if (tc.arealist[idx].ID == areaID) {
                matchCount++;
            }
        }
    }
    switch (matchCount) {
        case -1:  // Change ID
            tc.arealist[recIndex].ID = areaID;
            tc.arealist[recIndex].Name = areaName;
            makeAreaTable(tc.arealist);
            // TODO check scenes and switchplates
            break;
        case 0: // ID not changed
            tc.arealist[recIndex].Name = areaName;
            makeAreaTable(tc.arealist);
            break;
        default: $('.error').html('Duplicate ID');
    }
}

function areaAdd(data) {
    var id = $(this).parent().find("input.areaID").val();
    var name = $(this).parent().find("input.areaName").val();
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    var existingID = tc.arealist.find(a => a.ID == id);
    if (!existingID && id && name) {
        tc.arealist.push({ ID: id, Name: name });
        makeAreaTable(tc.config.arealist);
    } else {
        $('.error').html = 'Problem';
    }
}

// *****************Scene
function checkSelectedScene() {
    let selectedSceneID;
    if (selectRecord(this)) {
        selectedSceneID = $(this).find('input').val();
    } // else undefined
    t = tlcConfig.find(t => t.Name == tlc);
    switch ($('#subSection').val()) {
        case 'none': return;
        case 'Channels':
            makeSceneChannelTable(t.config.scenechannellist, selectedSceneID);
            break;
        case 'Switches':
            break;
    }
}

function updateScene(data) {
    makeSceneTable(data.info);
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t.config) t.config = {};
    t.config.scenelist = data.info;
}

function makeSceneTable(scenelist) {
    var idx = 0;
    var str = '<h3 style="width: 100%">scenes</h3>';
    scenelist.forEach(scene => {
        str += `<div class="ipFields" idx="${idx}">`;
        str += addInput('ID', 'sceneID' + scene.ID, 'sceneID',
            scene.ID, numberPattern, `0-${MAXSCENE-1}`);
        str += addInput('Name', 'sceneName' + scene.ID, 'sceneName',
            scene.Name, namePattern, `Up to ${MAXNAME-1} name characters`);
        str += '<fieldset>';
        str += addInput('FadeIn', 'FadeIn' + scene.ID, 'FadeIn',
            scene.FadeIn, numberPattern, "0-255");
        str += addInput('Duration', 'Duration' + scene.ID, 'Duration',
            scene.Duration, numberPattern, "0-255");
        str += addInput('FadeOut', 'FadeOut' + scene.ID, 'FadeOut',
            scene.FadeOut, numberPattern, "0-255");
        str += '</fieldset>';
        str += '<fieldset>';
        str += addInput('NextScene', 'NextScene' + scene.ID, 'NextScene',
            scene.NextScene, numberPattern, `0-${MAXSCENE-1}`);
        str += addInput('StartTime', 'StartTime' + scene.ID, 'StartTime',
            scene.StartTime, timePattern, "0-42:ss in steps of 10S");
        str += addInput('FadePrev', 'FadePrev' + scene.ID, 'FadePrev',
            scene.FadePrev, boolPattern, "true or false");
        str += '</fieldset>';
        str += '<button class="sceneAction">Update</button>';
        str += '</div>';
        idx++;
    });
    if (scenelist.length < MAXSCENE) {
        str += '<div class="ipFields">';
        str += addInput('ID', 'sceneID-new', 'sceneID',
            "", numberPattern, "0-9");
        str += addInput('Name', 'sceneName-new', 'sceneName',
            "", namePattern, `Up to ${MAXNAME - 1} name characters`);
        str += '<button class="sceneAdd">Add</button>';
        str += '</div>';
    } else {
        $('.error').html(`Reached max Areas (${MAXSCENE})`)
    }
    $('#sectionData').html(str);
    $('.sceneName').css('width', '8em')
    $('.StartTime,.FadePrev').css('width', '3em')
    $('.sceneID,.FadeIn,.FadeOut,.Duration,.NextScene').css('width', '2em')
    $('.sceneAction').click(sceneAction);
    $('.sceneAdd').click(sceneAdd);
    updateValidation();
    $('div#sectionData.ipFields div').click(checkSelectedScene);
}

function sceneAction(data) {
    var record = $(this).parent();
    if (!checkFieldStatus(record)) return;
    var sceneID = $(this).parent().find("input.sceneID").val();
    var sceneName = $(this).parent().find("input.sceneName").val();
    var recIndex = $(this).parent().attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    let matchCount = -1; // Default to 'ID has not changed'

    if (sceneID == '') { // Delete scene
        if (confirm(`Delete scene ${tc.scenelist[recIndex].ID}/${tc.scenelist[recIndex].Name}?`)) {
            tc.scenelist.splice(recIndex, 1);
            makeSceneTable(tc.scenelist);
        }
        return;
    }
    for (idx = 0; idx < tc.scenelist.length; idx++) {
        if (idx == recIndex) {
            if (tc.scenelist[idx].ID != sceneID) { // ID has changed
                matchCount = 0;
            }
        } else {
            if (tc.scenelist[idx].ID == sceneID) {
                matchCount++;
            }
        }
    }
    switch (matchCount) {
        case -1:  // Change ID
            tc.scenelist[recIndex].ID = sceneID;
            tc.scenelist[recIndex].Name = sceneName;
            makeSceneTable(tc.scenelist);
            // TODO check scenes and switchplates
            break;
        case 0: // ID not changed
            tc.scenelist[recIndex].Name = sceneName;
            makeSceneTable(tc.scenelist);
            break;
        default: $('.error').html('Duplicate ID');
    }
}

function sceneAdd(data) {
    var id = $(this).parent().find("input.sceneID").val();
    var name = $(this).parent().find("input.sceneName").val();
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    var existingID = tc.scenelist.find(a => a.ID == id);
    if (!existingID && id && name) {
        tc.scenelist.push({
            ID: id, Name: name,
            FadeIn: 0, Duration: 0, FadeOut: 0,
            NextScene: 255, StartTime: "42:30", FadePrev: false
        });
        makeSceneTable(tlcConfig.config.scenelist);
    } else {
        $('.error').html = 'Problem';
    }
}

// *****************Trigger
function updateTrigger(data) {
    makeTriggerTable(data.info);
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t.config) t.config = {};
    t.config.triggerlist = data.info;
}

function getTriggersHelp() {
    let str = '';

    str += '<p>This is a list of events that can cause a change of scene. ';
    str += 'The list is scanned to find a record that matches and the selected scene activated.</p>';
    str += '<p>The main criterea for triggering the scene is usually a button on the specified Switch Plate being pressed.</p>';
    return str;
}

function makeTriggerTable(triggerlist) {
    var idx = 0;
    var str = '<h3 id="triggers">Triggers<button class="help"> ? </button></h3>';
    triggerlist.forEach(trigger => {
        str += `<div class="ipFieldsx" idx="${idx}">`;
        str += '<fieldset><legend>Input</legend>';
        str += addSwitchPlateSpin('When Switch Plate', 'ipSWplate' + idx, 'ipSWplate',
            trigger.IPtrigger.swPlate, numberPattern, "0-255");
        str += addSwitchButtonSpin('button', 'ipSWbtn' + idx, 'ipSWbtn',
            trigger.IPtrigger.swBtn, numberPattern, "0-7");
        str += addSwitchButtonActionSpin('is', 'ipAction' + idx, 'ipAction',
            trigger.IPtrigger.Action, numberPattern, "0-255");
        str += '</fieldset>';

        str += addSceneSpin('Start Scene', 'triggerSceneID' + idx, 'triggerSceneID',
            trigger.SceneID, numberPattern, `0-${MAXSCENE - 1}`);

        str += addInput('and if Filters Enabled', 'FiltersEnabled' + idx, 'FiltersEnabled',
            trigger.FiltersEnabled, boolPattern, "true or false");
 
        str += '<fieldset><legend>then check State of</legend>';
        str += addSwitchPlateSpin('SWplate', 'stSWplate' + idx, 'stSWplate',
            trigger.IPstate1.swPlate, numberPattern, "0-255");
        str += addSwitchButtonActionSpin('SWbtn', 'stSWbtn' + idx, 'stSWbtn',
            trigger.IPstate1.swBtn, numberPattern, "0-7");
        str += addInput('is', 'stState' + idx, 'stState',
            trigger.IPstate1.state, numberPattern, "0-255");
        str += '</fieldset>';

        str += addInput('FiltersAnd', 'FiltersAnd' + idx, 'FiltersAnd',
            trigger.AndFilters, boolPattern, "true or false");

        str += '<fieldset><legend>Last Scene</legend>';
        str += addAreaSpin('AreaID', 'lsAreaID' + idx, 'lsAreaID',
            trigger.LastScene.AreaID, numberPattern, "0-42:ss in steps of 10S");
        str += addSceneSpin('SceneID', 'lsSceneID' + idx, 'lsSceneID',
            trigger.LastScene.notScene, boolPattern, "0-42:ss in steps of 10S");
        str += addInput('! Scene', 'notScene' + idx, 'notScene',
            trigger.LastScene.notScene, boolPattern, "0-42:ss in steps of 10S");
        str += '</fieldset>';

        str += '<button class="triggerAction">Update</button>';
        str += '</div>';
        idx++;
    });
    if (triggerlist.length < MAXTRIGGER) {
        str += '<div class="ipFields">';
        str += addInput('ID', 'triggerID-new', 'triggerID',
            "", numberPattern, "0-9");
        str += addInput('Name', 'triggerName-new', 'triggerName',
            "", namePattern, "Up to 15 name characters");
        str += '<button class="triggerAdd">Add</button>';
        str += '</div>';
    } else {
        $('.error').html(`Reached max Areas (${MAXTRIGGER})`)
    }
    $('#sectionData').html(str);
    $('.triggerSceneID,.lsAreaID,.lsSceneID').css('width', '12em')
    $('.FiltersEnabled,.FiltersAnd,.notScene').css('width', '3em');
    $('.ipSWplate,.ipSWbtn,.ipAction').css('width', '8em');
    $('.stSWplate,.stSWbtn,.stState').css('width', '8em');
    $('.triggerAction').click(triggerAction);
    $('.triggerAdd').click(triggerAdd);
    updateValidation();
    $('div#sectionData.ipFields div').click(selectRecord)
    $('button.help').click(showHelp);
}

function triggerAction(data) {
    var record = $(this).parent();
    if (!checkFieldStatus(record)) return;
    var goodCount = $(this).parent().find('input.good').length;
    var triggerID = $(this).parent().find("input.triggerID").val();
    var triggerName = $(this).parent().find("input.triggerName").val();
    var recIndex = $(this).parent().attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;

    switch (matchCount) {
        case -1:  // Change ID
            tc.triggerlist[recIndex].ID = triggerID;
            tc.triggerlist[recIndex].Name = triggerName;
            makeTriggerTable(tc.triggerlist);
            // TODO check triggers and switchplates
            break;
        case 0: // ID not changed
            tc.triggerlist[recIndex].Name = triggerName;
            makeTriggerTable(tc.triggerlist);
            break;
        default: $('.error').html('Duplicate ID');
    }
}

function triggerAdd(data) {
    var id = $(this).parent().find("input.triggerID").val();
    var name = $(this).parent().find("input.triggerName").val();
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    var existingID = tc.triggerlist.find(a => a.ID == id);
    if (!existingID && id && name) {
        tc.triggerlist.push({ ID: id, Name: name });
        makeTriggerTable(tc.triggerlist);
    } else {
        $('.error').html = 'Problem';
    }
}

// ***************************Sub-Section edits
function subSectionChanged(event) {
    if (tlc == 'none') {
        $('.error').html('TLc not selected');
        $(this).val('none')
        return;
    }
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t) { // 'none' ?
        $('#subSection').empty();
        return;
    }
    var subSection = this.value;
    switch (subSection) {
        case 'none':
            $('#subSectionData').empty();
            break;
        case 'Channels':
            switch ($('#section').val()) {
                case 'Area':
                    let selectedArea = $('#sectionData .selected .areaID').val();
                    if (t.config) {
                        if (t.config.channellist) {
                            makeChannelTable(t.config.channellist, selectedArea);
                        } else {
                            getSection('channels', (data) => updateChannels(data, selectedArea));
                        }
                    }
                    break;
                case 'Scene':
                    let selectedScene = $('#sectionData .selected .sceneID').val();
                    if (t.config) {
                        let names = [];
                        if (!t.config.scenechannellist) names.push({ name: 'scenechannels', list: 'scenechannellist' });
                        if (!t.config.channellist) names.push({ name: 'channels', list: 'channellist' });
                        if (!t.config.scenelist) names.push({ name: 'scenes', list: 'scenelist' });
                        let promises = names.map(item => getList(item.name).then((y) => y));
                        Promise.all(promises).then(results => {
                            results.forEach((r, idx) => t.config[names[idx].list] = r.info);
                            makeSceneChannelTable(t.config.scenechannellist, selectedScene);
                            $('.error').empty();
                        })
                        .catch(err => $('.error').html(`Downloading Error ${err}`));
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
                        if (t.config.switchplatelist) {
                            makeSwitchTable(t.config.switchplatelist, selectedArea);
                        } else {
                            getSection('switchplates', (data) => updateSwitch(data, selectedArea));
                        }
                    }
                    break;
                default:
                    $('#subSection').empty();
                    return;
            }
            break;
    }
}

// *****************(Area) Channels
function updateChannels(data, selectedArea) {
    makeChannelTable(data.info, selectedArea);
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t.config) t.config = {};
    t.config.channellist = data.info;
}

function makeChannelTable(channelslist, selectedArea) {
    var idx = 0;
    var str = '<h3 style="width: 100%">Channels</h3>';
    channelslist.forEach(channel => {
        if (!selectedArea || selectedArea == channel.AreaID) {
            str += `<div class="ipFields" idx="${idx}">`;
            str += addInput('ID', 'channelID' + channel.ID, 'channelID',
                channel.ID, numberPattern, `0-${MAXCHANNEL}-1`);
            str += addInput('Name', 'channelName' + channel.ID, 'channelName',
                channel.Name, namePattern, `Up to ${MAXNAME} name characters`);
            str += addInput('AreaID', 'areaID' + channel.ID, 'areaID',
                channel.AreaID, numberPattern, `0-${MAXAREA - 1}`);
            str += '<button class="channelAction">Update</button>';
            str += '</div>';
            idx++;
        }
    });
    if (channelslist.length < MAXCHANNEL) {
        str += '<div class="ipFields">';
        str += addInput('ID', 'channelID-new', 'channelID',
            "", numberPattern, `0-${MAXCHANNEL}-1`);
        str += addInput('Name', 'channelName-new', 'channelName',
            "", namePattern, `Up to ${MAXNAME - 1} name characters`);
        str += addInput('AreaID', 'areaID-new', 'areaID',
            selectedArea, numberPattern, `0-${MAXAREA - 1}`);
        str += '<button class="channelAdd">Add</button>';
        str += '</div>';
    } else {
        $('.error').html(`Reached max Areas (${MAXCHANNEL})`)
    }
    $('#subSectionData').html(str);
    $('.channelName').css('width', '10em')
    $('.channelID,.areaID').css('width', '1em')
    $('.channelAction').click(channelAction);
    $('.channelAdd').click(channelAdd);
    updateValidation();
}

function checkAreaID(areaID) {
    if (!tc.arealist) {
        if (!tc.arealist.find(a => a.ID == areaID)) {
            $('.error').html = `Area ID ${areaID} not found`;
            return false;
        }
    } else {
        return false;
    }
    return true;
}

function channelAction(data) {
    var record = $(this).parent();
    if (!checkFieldStatus(record)) return;
    var channelID = record.find("input.channelID").val();
    var areaID = record.find("input.areaID").val();
    var channelName = record.find("input.channelName").val();
    var recIndex = record.attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    let matchCount = -1; // Default to 'ID has not changed'

    if (channelID == '') { // Delete channel
        if (confirm(`Delete channel ${tc.channellist[recIndex].ID}/${tc.channellist[recIndex].Name}?`)) {
            tc.channellist.splice(recIndex, 1);
            makeChannelTable(tc.channellist);
        }
        return;
    }
    for (idx = 0; idx < tc.channellist.length; idx++) {
        if (idx == recIndex) {
            if (tc.channellist[idx].ID != channelID) { // ID has changed
                matchCount = 0;
            }
        } else {
            if (tc.channellist[idx].ID == channelID) {
                matchCount++;
            }
        }
    }

    function checkUpdate() {
        if (!checkAreaID(areaID)) {
            return false;
        } else {
            tc.channellist[recIndex] = {
                ID: channelID,
                Name: channelName,
                AreaID: a.ID,
                Area: a.Name
            };
        }
        return true;
    }
    switch (matchCount) {
        case -1:  // OK to Change ID
        case 0: // ID not changed
            if (checkUpdate()) {
                makeChannelTable(tc.channellist);
                record.find('input.good').removeClass('good');
            }
            break;
        default: $('.error').html('Duplicate ID');
    }
}

function channelAdd(data) {
    var id = $(this).parent().find("input.channelID").val();
    var name = $(this).parent().find("input.channelName").val();
    var areaID = $(this).parent().find("input.areaID").val();
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    if (!checkAreaID(areaID)) return;
    var existingID = tc.channellist.find(c => c.ID == id);
    if (!existingID && id && name && areaID) {
        tc.channellist.push({
            ID: id,
            Name: name,
            AreaID: areaID
        });
        makeChannelTable(tc.channellist);
    } else {
        $('.error').html = 'Problem';
    }
}

// *****************(Area) Switches
function updateSwitch(data, selectedArea) {
    makeSwitchTable(data.info, selectedArea);
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t.config) t.config = {};
    t.config.switchplatelist = data.info;
}

function makeSwitchTable(switchplatelist, selectedArea) {
    var idx = 0;
    var str = '<h3 style="width: 100%">Switches</h3>';
    switchplatelist.forEach(swtch => {
        if (!selectedArea || selectedArea == swtch.AreaID) {
            str += `<div class="ipFields" idx="${idx}">`;
            str += addInput('ID', 'swtchID' + swtch.ID, 'swtchID',
                swtch.ID, numberPattern, `0-${MAXSWITCHPLATE - 1}`);
            str += addInput('AreaID', 'swtchAreaID' + swtch.ID, 'swtchAreaID',
                swtch.AreaID, numberPattern, `0-${MAXAREA - 1}`);
            str += addInput('Name', 'swtchName' + swtch.ID, 'swtchName',
                swtch.Name, namePattern, `Up to ${MAXNAME - 1} name characters`);
            str += '<fieldset>';
            str += addInput('LDRlevelHigh', 'LDRlevelHigh' + swtch.ID, 'LDRlevelHigh',
                swtch.LDRlevelHigh, numberPattern, "0-255");
            str += addInput('LDRlevelLow', 'LDRlevelLow' + swtch.ID, 'LDRlevelLow',
                swtch.LDRlevelLow, numberPattern, "0-255");
            str += '</fieldset>';
            str += '<button class="switchAction">Update</button>';
            str += '</div>';
            idx++;
        }
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
        str += addInput('LDRlevelHigh', 'LDRlevelHigh-new', 'LDRlevelHigh',
            0, numberPattern, "0-255");
        str += addInput('LDRlevelLow', 'LDRlevelLow-new', 'LDRlevelLow',
            0, numberPattern, "0-255");
        str += '</fieldset>';
        str += '<button class="switchAdd">Add</button>';
        str += '</div>';
    } else { 
        $('.error').html(`Reached max Areas (${MAXSWITCHPLATE})`)
    }
    $('#subSectionData').html(str);
    $('.swtchName').css('width', '8em')
    $('.LDRlevelHigh,.FadePrev').css('width', '3em')
    $('.swtchID,.swtchAreaID,.LDRlevelLow').css('width', '2em')
    $('.switchAction').click(switchAction);
    $('.switchAdd').click(switchAdd);
    updateValidation();
}

function switchAction(data) {
    var record = $(this).parent();
    if (!checkFieldStatus(record)) return;
    var swtchID = $(this).parent().find("input.swtchID").val();
    var swtchName = $(this).parent().find("input.swtchName").val();
    var recIndex = $(this).parent().attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    let matchCount = -1; // Default to 'ID has not changed'

    if (swtchID == '') { // Delete swtch
        if (confirm(`Delete swtch ${tc.switchplatelist[recIndex].ID}/${tc.switchplatelist[recIndex].Name}?`)) {
            tc.switchplatelist.splice(recIndex, 1);
            makeSwitchTable(tc.switchplatelist);
        }
        return;
    }
    for (idx = 0; idx < tc.switchplatelist.length; idx++) {
        if (idx == recIndex) {
            if (tc.switchplatelist[idx].ID != swtchID) { // ID has changed
                matchCount = 0;
            }
        } else {
            if (tc.switchplatelist[idx].ID == swtchID) {
                matchCount++;
            }
        }
    }
    switch (matchCount) {
        case -1:  // Change ID
            tc.switchplatelist[recIndex].ID = swtchID;
            tc.switchplatelist[recIndex].Name = swtchName;
            makeSwitchTable(tc.switchplatelist);
            // TODO check swtchs and switchplates
            break;
        case 0: // ID not changed
            tc.switchplatelist[recIndex].Name = swtchName;
            makeSwitchTable(tc.switchplatelist);
            break;
        default: $('.error').html('Duplicate ID');
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
        makeSwitchTable(tlcConfig.config.switchplatelist);
    } else {
        $('.error').html = 'Problem';
    }
}

// *****************SceneChannels
function updateSceneChannels(data, selectedScene) {
    makeSceneChannelTable(data.info, selectedScene);
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t.config) t.config = {};
    t.config.scenechannellist = data.info;
}

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
    $('#sliderDone').click(closeSlider);
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
    if (confirm(`Delete Scene/Channel ${tc.scenechannellist[recIndex].SceneID}/${tc.scenechannellist[recIndex].Channe.ID}?`)) {
        tc.scenechannellist.splice(recIndex, 1);
        makeSwitchTable(tc.scenechannellist);
    }
}

function makeSceneChannelTable(scenechannelslist, selectedScene) {
    var idx = 0;
    var str = '<h3 style="width: 100%">Scene Channels</h3>';
    scenechannelslist.forEach(channel => {
        if (!selectedScene || selectedScene == channel.SceneID) {
            str += `<div class="ipFields" idx="${idx}" id="channelScene${idx}">`;
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
        }
    });
    if (scenechannelslist.length < MAXCHANNEL) {
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
    $('.ChannelValue').contextmenu(showSlider);
    $('.sceneChannelAction').click(sceneChannelAction);
    $('.sceneChannelDelete').click(sceneChannelDelete);
    $('.sceneChannelAdd').click(sceneChannelAdd);
    updateValidation();
}

function checkSceneID(sceneID) {
    if (tc.scenelist) {
        if (!tc.scenelist.find(s => s.ID == sceneID)) {
            $('.error').html(`Scene ID ${areaID} not found`);
            return false;
        }
    } else {
        $('.error').html(`SceneList is not loaded`);
        return false;
    }
    return true;
}

function sceneChannelAction(data) {
    var record = $(this).parent();
    if (!checkFieldStatus(record)) return;
    var channelSceneID = record.find("input.channelSceneID").val();
    var areaID = record.find("input.areaID").val();
    var channelName = record.find("input.channelName").val();
    var recIndex = record.attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    let matchCount = -1; // Default to 'ID has not changed'

    function checkUpdate() {
        if (!checkAreaID(areaID)) {
            return false;
        } else {
            tc.scenehannellist[recIndex] = {
                ID: channelID,
                Name: channelName,
                AreaID: a.ID,
                Area: a.Name
            };
        }
        return true;
    }

    if (checkUpdate()) {
        makeSceneChannelTable(tc.scenehannellist);
        record.find('input.good').removeClass('good');
    }

}

function sceneChannelAdd(data) {
    var id = $(this).parent().find("input.channelID").val();
    var name = $(this).parent().find("input.channelName").val();
    var areaID = $(this).parent().find("input.areaID").val();
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    if (!checkAreaID(areaID)) return;
    var existingID = tc.scenehannellist.find(c => c.ID == id);
    if (!existingID && id && name && areaID) {
        tc.scenehannellist.push({
            ID: id,
            Name: name,
            AreaID: areaID
        });
        makeAreaTable(tc.scenehannellist);
    } else {
        $('.error').html = 'Problem';
    }
}
