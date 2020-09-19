const MAXCHANNEL = 31
const MAXAREA = 10
const MAXNAME = 16
const MAXSCENECHANNEL = 64
const MAXSCENE = 31
const MAXTRIGGER = 60

const macPattern    = `^(?:[0-9a-fA-F]{2}\:){5}[0-9a-fA-F]{2}$`;
const namePattern   = `^(?:[\\w\\- ]{1,${MAXNAME-1}}|)$`;
const urlPattern    = '^(?:[a-zA-Z0-9_]{2,100}\.){1,10}[a-zA-Z0-9_]{2,100}$'
const ipPattern     = `^(?:[0-9]{1,3}\.){3}[0-9]{1,3}|$`;
const numberPattern = `^(?:[0-9]{1,3}|)$`;
const timePattern   = `^(?:[0-4][0-9]:[0-3]0|)$`;
const boolPattern   = `^(?:true|false|)$`;

var tlc = 'none';

$(function () {
    $("#tlC").on('change', tlcChanged);
    $("#section").on('change', sectionChanged);
    $("#subSection").on('change', subSectionChanged);
    $('.areaAction').on('click', areaAction);
    $('.areaAdd').on('click', areaAdd);
});

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

function tlcChanged(event) {
    tlc = this.value;
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t) { // 'none' ?
        $('#system').empty();
        return;
    }
    function getSysinfo() {
        let url = `http://${t.IPaddress}:9073/system?serialNo=${t.serNo}&callback=?`;
        $.getJSON(url, updateSystem)
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });
    }

    function getMeta() {
        url = `/tlcEdit/getMeta?tlc=${t.Name}`;
        $.getJSON(url, updateMeta)
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });
    }

    if (t.config) {
        if (t.config.sysinfo) {
            makeSystemTable(t.config.sysinfo);
        } else {
            getSysinfo();
        }
        if (!t.meta) {
            makeMetaTable(t.config.meta);
        } else {
            getMeta()
        }
    } else {
        getSysinfo();
        getMeta();
    }
    $('#section').val('none');
    $('#sectionData').empty();
    $('#subSection').val('none');
    $('#subSectionData').empty();
}

function addInput(label, id, fieldName, value, pattern, title) {
    let str = `<label>${label}: `;
    str += `<input type="text" class="${fieldName}" name="${fieldName}" id="${id}" `;
    str += `value="${value}"`;
    if (pattern) str+= ` pattern="${pattern}"`;
    if (title) str+= ` title="${title}"`;
    str+= `></label>`;
    return str;
}

function addSpan(label, id, fieldName, value) {
    let str = `<label>${label}: `;
    str += `<span class="${fieldName}" name="${fieldName}" id="${id}" `;
    str += `value="${value}"`;
    str+= `</span></label>`;
    return str;
}

function selectRecord() {
    $(this).addClass('selected').siblings().removeClass('selected');
}

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
    $("#systemAction").on("click", systemAction);
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
        SubNetMask:checkNull('.systemSubNet'),
        GatewayIP: checkNull('.systemGW'),
        DNSaddress: checkNull('.systemDNS')
    };
    record.find('input.good').removeClass('good');
}

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
    $("#metaAction").on("click", metaAction);
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
    function getAreas() {
        let url = `http://${t.IPaddress}:9073/areas?serialNo=${t.serNo}&callback=?`;
        $.getJSON(url, updateArea)
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });
    }
    function getScenes() {
        let url = `http://${t.IPaddress}:9073/scenes?serialNo=${t.serNo}&callback=?`;
        $.getJSON(url, updateScene)
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });
    }
    function getTriggers() {
        let url = `http://${t.IPaddress}:9073/triggers?serialNo=${t.serNo}&callback=?`;
        $.getJSON(url, updateTrigger)
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });
    }

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
            break;
        case "Area":
            if (t.config) {
                if (t.config.arealist) {
                    makeAreaTable(t.config.arealist);
                } else {
                    getAreas();
                }
            }
            $("#subSection option").removeAttr("disabled"); // Channels and Switches enabled
            break;     
        case "Scene":
            if (t.config) {
                if (t.config.scenelist) {
                    makeSceneTable(t.config.scenelist);
                } else {
                    getScenes();
                }
            }
            $("#subSection option").removeAttr("disabled"); // Switches disabled
            $("#subSection option[value='Switches']").attr("disabled", "disabled");
            break;     
        case "Trigger":
            if (t.config) {
                if (t.config.arealist) {
                    makeTriggerTable(t.config.arealist);
                } else {
                    getTriggers();
                }
            }
            $("#subSection option").attr("disabled", "disabled");
            $("#subSection option[value='none']").removeAttr("disabled"); 
            break;     
    }
}

// *****************Area
function updateArea(data) {
    makeAreaTable(data.info);
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t.config) t.config = {};
    t.config.arealist = data.info;
}

function makeAreaTable(areaList) {
    var idx = 0;
    var str = '<h3 style="width: 100%">Areas</h3>';
    areaList.forEach(area => {
        str += `<div class="ipFields" idx="${idx++}">`;
        str += addInput('ID', 'areaID'+area.ID, 'areaID', 
            area.ID, numberPattern, "0-9");
        str += addInput('Name', 'areaName'+area.ID, 'areaName', 
            area.Name, namePattern, 'Up to 15 name characters');
        str += '<button class="areaAction">Update</button>';
        str += '</div>';
    });
    str += '<div class="ipFields">';
    str += addInput('ID', 'areaID-new', 'areaID', 
        "", numberPattern, "0-9");
    str += addInput('Name', 'areaName-new', 'areaName',
        "", namePattern, "Up to 15 name characters");
    str += '<button class="areaAdd">Add</button>';
    str += '</div>';
    $('#sectionData').html(str);
    $('.areaName').css('width', '10em')
    $('.areaID').css('width', '1em')
    $('.areaAction').on('click', areaAction);
    $('.areaAdd').on('click', areaAdd);
    updateValidation();
    $('div#sectionData.ipFields div').on('click', selectRecord)
}

function areaAction(data) {
    var record = $(this).parent();
    var badCount = record.find('input.bad').length;
    var goodCount = record.find('input.good').length;
    var areaID = record.find("input.areaID").val();
    var areaName = record.find("input.areaName").val();
    var recIndex = record.attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    let matchCount = -1; // Default to 'ID has not changed'
    if (badCount > 0) {
        $('.error').html('Correct bad fields first');
        return;
    }
    if (goodCount == 0) return; // Nothing changed

    if (areaID == '') { // Delete area
        if (confirm(`Delete area ${tc.arealist[recIndex].ID}/${tc.arealist[recIndex].Name}?`)) {
            tc.arealist.splice(recIndex, 1);
            makeAreaTable(tc.arealist);
        }
        return;
    }
    for (idx=0; idx < tc.arealist.length; idx++) {
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
        tc.arealist.push({ID: id, Name: name});
        makeAreaTable(tc.config.arealist);
    } else {
        $('.error').html = 'Problem';
    }
}

// *****************Scene
function updateScene(data) {
    makeSceneTable(data.info);
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t.config) t.config = {};
    t.config.scenelist = data.info;
}

function makeSceneTable(sceneList) {
    var idx = 0;
    var str = '<h3 style="width: 100%">scenes</h3>';
    sceneList.forEach(scene => {
        str += `<div class="ipFields" idx="${idx++}">`;
        str += addInput('ID', 'sceneID' + scene.ID, 'sceneID',
            scene.ID, numberPattern, "0-31");
        str += addInput('Name', 'sceneName' + scene.ID, 'sceneName',
            scene.Name, namePattern, 'Up to 15 name characters');
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
            scene.NextScene, numberPattern, "0-31");
        str += addInput('StartTime', 'StartTime' + scene.ID, 'StartTime',
            scene.StartTime, timePattern, "0-42:ss in steps of 10S");
        str += addInput('FadePrev', 'FadePrev' + scene.ID, 'FadePrev',
            scene.FadePrev, boolPattern, "true or false");
        str += '</fieldset>';
        str += '<button class="sceneAction">Update</button>';
        str += '</div>';
    });
    str += '<div class="ipFields">';
    str += addInput('ID', 'sceneID-new', 'sceneID', 
        "", numberPattern, "0-9");
    str += addInput('Name', 'sceneName-new', 'sceneName',
        "", namePattern, "Up to 15 name characters");
    str += '<button class="sceneAdd">Add</button>';
    str += '</div>';
    $('#sectionData').html(str);
    $('.sceneName').css('width', '8em')
    $('.StartTime,.FadePrev').css('width', '3em')
    $('.sceneID,.FadeIn,.FadeOut,.Duration,.NextScene').css('width', '2em')
    $('.sceneAction').on('click', sceneAction);
    $('.sceneAdd').on('click', sceneAdd);
    updateValidation();
    $('div#sectionData.ipFields div').on('click', selectRecord)
}

function sceneAction(data) {
    var badCount = $(this).parent().find('input.bad').length;
    var goodCount = $(this).parent().find('input.good').length;
    var sceneID = $(this).parent().find("input.sceneID").val();
    var sceneName = $(this).parent().find("input.sceneName").val();
    var recIndex = $(this).parent().attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    let matchCount = -1; // Default to 'ID has not changed'
    if (badCount > 0) {
        $('.error').html('Correct bad fields first');
        return;
    }
    if (goodCount == 0) return; // Nothing changed

    if (sceneID == '') { // Delete scene
        if (confirm(`Delete scene ${tc.scenelist[recIndex].ID}/${tc.scenelist[recIndex].Name}?`)) {
            tc.scenelist.splice(recIndex, 1);
            makeSceneTable(tc.scenelist);
        }
        return;
    }
    for (idx=0; idx < tc.scenelist.length; idx++) {
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
            FadeIn:0, Duration:0, FadeOut:0, 
            NextScene:255, StartTime:"42:30", FadePrev:false});
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

function makeTriggerTable(triggerList) {
    var idx = 0;
    var str = '<h3 style="width: 100%">triggers</h3>';
    triggerList.forEach(trigger => {
        str += `<div class="ipFields" idx="${idx++}">`;
        str += addInput('ID', 'triggerID' + trigger.ID, 'triggerID',
            trigger.ID, numberPattern, "0-31");
        str += addInput('Name', 'triggerName' + trigger.ID, 'triggerName',
            trigger.Name, namePattern, 'Up to 15 name characters');
        str += addInput('FadeIn', 'FadeIn' + trigger.ID, 'FadeIn',
            trigger.FadeIn, numberPattern, "0-255");
        str += addInput('Duration', 'Duration' + trigger.ID, 'Duration',
            trigger.Duration, numberPattern, "0-255");
        str += addInput('FadeOut', 'FadeOut' + trigger.ID, 'FadeOut',
            trigger.FadeOut, numberPattern, "0-255");
        str += addInput('Nexttrigger', 'Nexttrigger' + trigger.ID, 'Nexttrigger',
            trigger.Nexttrigger, numberPattern, "0-31");
        str += addInput('StartTime', 'StartTime' + trigger.ID, 'StartTime',
            trigger.StartTime, timePattern, "0-42:ss in steps of 10S");
        str += addInput('FadePrev', 'FadePrev' + trigger.ID, 'FadePrev',
            trigger.FadePrev, boolPattern, "true or false");
        str += '<button class="triggerAction">Update</button>';
        str += '</div>';
    });
    str += '<div class="ipFields">';
    str += addInput('ID', 'triggerID-new', 'triggerID', 
        "", numberPattern, "0-9");
    str += addInput('Name', 'triggerName-new', 'triggerName',
        "", namePattern, "Up to 15 name characters");
    str += '<button class="triggerAdd">Add</button>';
    str += '</div>';
    $('#sectionData').html(str);
    $('.triggerName,.StartTime,.FadePrev').css('width', '8em')
    $('.triggerID,.FadeIn,.FadeOut,.Duration,.Nexttrigger').css('width', '2em')
    $('.triggerAction').on('click', triggerAction);
    $('.triggerAdd').on('click', triggerAdd);
    updateValidation();
    $('div#sectionData.ipFields div').on('click', selectRecord)
}

function triggerAction(data) {
    var badCount = $(this).parent().find('input.bad').length;
    var goodCount = $(this).parent().find('input.good').length;
    var triggerID = $(this).parent().find("input.triggerID").val();
    var triggerName = $(this).parent().find("input.triggerName").val();
    var recIndex = $(this).parent().attr("idx");
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    let matchCount = -1; // Default to 'ID has not changed'
    if (badCount > 0) {
        $('.error').html('Correct bad fields first');
        return;
    }
    if (goodCount == 0) return; // Nothing changed

    if (triggerID == '') { // Delete trigger
        if (confirm(`Delete trigger ${tc.triggerlist[recIndex].ID}/${tc.triggerlist[recIndex].Name}?`)) {
            tc.triggerlist.splice(recIndex, 1);
            makeTriggerTable(tc.triggerlist);
        }
        return;
    }
    for (idx=0; idx < tc.triggerlist.length; idx++) {
        if (idx == recIndex) {
            if (tc.triggerlist[idx].ID != triggerID) { // ID has changed
                matchCount = 0;
            }
        } else {
            if (tc.triggerlist[idx].ID == triggerID) {
                matchCount++;
            }
        }
    }
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
        tc.triggerlist.push({ID: id, Name: name});
        makeTriggerTable(tc.triggerlist);
    } else {
        $('.error').html = 'Problem';
    }
}

// ***************************Sub-Section edits
function subSectionChanged(event) {
    function getChannels() {
        let url = `http://${t.IPaddress}:9073/channels?serialNo=${t.serNo}&callback=?`;
        $.getJSON(url, updateChannels)
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });
    }
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
                    let selectedArea = $('#sectionData .selected ID').val();
                    if (t.config) {
                        if (t.config.channellist) {
                            makeChannelTable(t.config.channellist, selectedArea);
                        } else {
                            getChannels();
                        }
                    }
                    break;
                case 'Scene':
                default:
                    $('#subSection').empty();
                    return;
            }
            break;
        case 'Switches':
            break;
    }
}

// *****************Channels
function updateChannels(data) {
    makeChannelTable(data.info);
    t = tlcConfig.find(t => t.Name == tlc);
    if (!t.config) t.config = {};
    t.config.channellist = data.info;
}

function makeChannelTable(channelsList) {
    var idx = 0;
    var str = '<h3 style="width: 100%">Channels</h3>';
    channelsList.forEach(channel => {
        str += `<div class="ipFields" idx="${idx++}">`;
        str += addInput('ID', 'channelID'+channel.ID, 'channelID', 
            channel.ID, numberPattern, `0-${MAXCHANNEL}-1`);
       str += addInput('Name', 'channelName'+channel.ID, 'channelName', 
            channel.Name, namePattern, 'Up to 15 name characters');
        str += addInput('AreaID', 'areaID'+channel.ID, 'areaID', 
            channel.AreaID, numberPattern, `0-${MAXAREA-1}`);
        str += '<button class="channelAction">Update</button>';
        str += '</div>';
    });
    str += '<div class="ipFields">';
    str += addInput('ID', 'channelID-new', 'channelID', 
        "", numberPattern, `0-${MAXCHANNEL}-1`);
    str += addInput('Name', 'channelName-new', 'channelName',
        "", namePattern, `Up to ${MAXNAME-1} name characters`);
    str += addInput('AreaID', 'areaID-new', 'areaID', 
        "", numberPattern, `0-${MAXAREA-1}`);
    str += '<button class="channelAdd">Add</button>';
    str += '</div>';
    $('#subSectionData').html(str);
    $('.channelName').css('width', '10em')
    $('.channelID,.areaID').css('width', '1em')
    $('.channelAction').on('click', channelAction);
    $('.channelAdd').on('click', channelAdd);
    updateValidation();
    // $('div#subSectionData.ipFields div').on('click', selectRecord)
}

function channelAction(data) {
    var record =  $(this).parent();
    var badCount = record.find('input.bad').length;
    var goodCount = record.find('input.good').length;
    if (badCount > 0) {
        $('.error').html('Correct bad fields first');
        return;
    }
    if (goodCount == 0) return; // Nothing changed
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
    for (idx=0; idx < tc.channellist.length; idx++) {
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
        a = tc.arealist.find(a => a.ID == areaID);
        if (!a) {
            $('.error').html(`Area ${areaID} does not exist`);
            return false;
        } else {
            tc.channellist[recIndex] = {
                ID: channelID, 
                Name: channelName, 
                AreaID: a.ID, 
                Area: a.Name};
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
    // TODO validate area id
    var t = tlcConfig.find(t => t.Name == tlc);
    var tc = t.config;
    var existingID = tc.channellist.find(c => c.ID == id);
    if (!existingID && id && name && areaID) {
        tc.channellist.push({
            ID: id, 
            Name: name,
        AreaID: areaID});
        makeAreaTable(tc.channellist);
    } else {
        $('.error').html = 'Problem';
    }
}
