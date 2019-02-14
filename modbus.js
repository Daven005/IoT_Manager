var net = require('net');
var path = require('path');
var Struct = require('struct');

const timeout = setInterval(rqData, 1*60*1000);
const registerStartInverterCommon = 40000;
const registerStartInverterData = 40069;
const registerStartMeterCommon = 40121;
const registerStartMeterData = 40187;
const modbusPort = config.modbus.port;
const modbusIP = config.modbus.ip_address;

var inverterInfo = '';
var meterInfo = '';
var inverterData = {};
var meterData = {};
var transaction = 0;
var modbusConnected = false;
var modbusFatalError = false;

const RQ_COMMON_INVERTER = 0x11;
const RQ_COMMON_METER = 0x12;
const RQ_DATA_INVERTER = 0x21;
const RQ_DATA_METER = 0x22;

const stateString = [
  'UNKNOWN', 
  'OFF', 
  'SLEEPING',
  'STARTING',
  'ON (MPPT)',
  'THROTTLED',
  'SHUTTING DOWN',
  'FAULT',
  'STANDBY'
];

var cmd = Struct()
	.word16Ube('transID')
	.word16Ube('protocol')
	.word16Ube('length')
	.word8('unitID')
	.word8('funct')
	.word16Ube('register')
	.word16Ube('words')
;
cmd.allocate();

var responseCommonInverter = Struct()
	.word16Ube('transID')
	.word16Ube('protocol')
	.word16Ube('length')
	.word8('unitID')
	.word8('funct')
	.word8('bytes')
	.chars('SS_ID', 4)
	.word16Ube('SS_DID')
	.word16Ube('SS_len')
	.chars('manufacturer',32)
	.chars('model',32)
	.chars('option',16)
	.chars('version',16)
	.chars('serialNumber',32)
;
responseCommonInverter.allocate();

var responseCommonMeter = Struct()
	.word16Ube('transID')
	.word16Ube('protocol')
	.word16Ube('length')
	.word8('unitID')
	.word8('funct')
	.word8('bytes')
	.word16Ube('SS_DID')
	.word16Ube('SS_len')
	.chars('manufacturer',32)
	.chars('model',32)
	.chars('option',16)
	.chars('version',16)
	.chars('serialNumber',32)
;
responseCommonMeter.allocate();

var responseInverterData = Struct()
	.word16Ube('transID')
	.word16Ube('protocol')
	.word16Ube('length')
	.word8('unitID')
	.word8('funct')
	.word8('bytes')
	.word16Ube('SS_DID2')
	.word16Ube('SS_len2')
	.word16Ube('current')
	.array('pad2', 3, 'word16Ube')
	.word16Sbe('current_SF')
	.word16Ube('voltage')
	.array('pad3', 5, 'word16Ube')
	.word16Sbe('voltage_SF')
	.word16Sbe('power')
	.word16Sbe('power_SF')
	.word16Ube('frequency')
	.word16Sbe('frequency_SF')
	.word16Sbe('VA')
	.word16Sbe('VA_SF')
	.word16Sbe('VAR')
	.word16Sbe('VAR_SF')
	.word16Sbe('PF')
	.word16Sbe('PF_SF')
	.word32Ube('energy')
	.word16Sbe('energy_SF')
	.word16Ube('DC_current')
	.word16Sbe('DC_current_SF')
	.word16Ube('DC_voltage')
	.word16Sbe('DC_voltage_SF')
	.word16Sbe('DC_power')
	.word16Sbe('DC_power_SF')
	.word16Ube('pad4')
	.word16Ube('temp')
	.array('pad5', 2, 'word16Ube')
	.word16Sbe('temp_SF')
	.word16Sbe('state')
	.word16Sbe('status')
;
responseInverterData.allocate();


var responseMeterData = Struct()
	.word16Ube('transID')
	.word16Ube('protocol')
	.word16Ube('length')
	.word8('unitID')
	.word8('funct')
	.word8('bytes')
	.word16Ube('SS_DID2')
	.word16Ube('SS_len2')
	.word16Ube('current')
	.array('pad2', 3, 'word16Ube')
	.word16Sbe('current_SF')
	.word16Ube('voltage')
	.array('pad3', 5, 'word16Ube')
	.word16Sbe('voltage_SF')
	.word16Sbe('power')
	.word16Sbe('power_SF')
	.word16Ube('frequency')
	.word16Sbe('frequency_SF')
	.word16Sbe('VA')
	.word16Sbe('VA_SF')
	.word16Sbe('VAR')
	.word16Sbe('VAR_SF')
	.word16Sbe('PF')
	.word16Sbe('PF_SF')
	.word32Ube('energy')
	.word16Sbe('energy_SF')
	.word16Ube('DC_current')
	.word16Sbe('DC_current_SF')
	.word16Ube('DC_voltage')
	.word16Sbe('DC_voltage_SF')
	.word16Sbe('DC_power')
	.word16Sbe('DC_power_SF')
	.word16Ube('pad4')
	.word16Ube('temp')
	.array('pad5', 2, 'word16Ube')
	.word16Sbe('temp_SF')
	.word16Sbe('state')
	.word16Sbe('status')
;
responseMeterData.allocate();

var modbusClient;
if (config.modbus.enabled) {
	startModbus();
} else {
	console.log("Modbus not enabled");
}

function startModbus() {
	var refusedCount = 0;
	
	console.log("Starting modbus on %s:%s", modbusIP, modbusPort);
	modbusClient = net.connect(modbusPort, modbusIP);

	modbusClient.on('connect', function(){
	  console.log('*********Modbus connected**********');
	  modbusConnected = true;
	  refusedCount = 0;
	  rqModbus(registerStartInverterCommon, RQ_COMMON_INVERTER, 70);
	});

	modbusClient.on('data', function(data){
	  //console.log(data);
	  var resp = responseCommonInverter.fields;
	  responseCommonInverter._setBuff(data);
	  switch (resp.transID & 0xff) {
	  case RQ_COMMON_INVERTER:
		inverterInfo = makeInfoString(resp);
		rqModbus(registerStartMeterCommon, RQ_COMMON_METER, 70);
		break;
	  case RQ_COMMON_METER:
		resp = responseCommonMeter.fields
		responseCommonMeter._setBuff(data);
		meterInfo = makeInfoString(resp);
		rqData();
		break;
	  case RQ_DATA_INVERTER:
		if (transaction == (resp.transID >> 8)) {
		  inverterData = decodeInverterData(data);
		  printData("Inverter", inverterData);
		} else {
		  console.log("Duplicate transaction %d:%d", resp.transID & 8, resp.transID >> 8);
		}
		break;
	  case RQ_DATA_METER:
		meterData = decodeMeterData(data);
		break;
	  default:
		console.log("?? %d", resp.transID);
	  }
	});

	modbusClient.on('error', function(err){
	  console.log('**********Modbus error: %s', err.message);
	  if (err.message.indexOf('REFUSED') > 0) {
		if (++refusedCount > 10) modbusFatalError = true;
	  }
	  modbusClient.end();
	});

	modbusClient.on('close', function(){
	  modbusClient.end();
	  console.log('*********Modbus Closed   *********');
	  modbusConnected = false;
	  if (!modbusFatalError && config.modbus.enabled)
		setTimeout(function() {modbusClient.connect(modbusPort, modbusIP)}, 5000);
	});
}

function rqModbus(start, trans, words) {
  var cmdBuf = cmd.buffer();
  var readCmd = cmd.fields;
  readCmd.transID = trans;
  readCmd.protocol = 0;
  readCmd.length = 6;
  readCmd.unitID = 1;
  readCmd.funct = 3;
  readCmd.register = start;
  readCmd.words = words;
  modbusClient.write(cmdBuf);
}

function rqData() {
  if (modbusConnected) {
    transaction++;
    transaction &= 0xff;
    rqModbus(registerStartInverterData, RQ_DATA_INVERTER + (transaction<<8), 70);
  }
}

function printData(s, d) {
  var dt = new Date;
  console.log("%s (%d - %d:%d:%d)", 
    s, transaction, dt.getHours(), dt.getMinutes(), dt.getSeconds());
  console.log("AC %sW DC %sW Total %skWh Temp %sC State %s",
    d.acPower.toFixed(1), d.dcPower.toFixed(1), (d.energy/1000).toFixed(1), 
    d.temp.toFixed(2), stateString[d.state]);
  client.publish('/App/Garage/modbus/AC power', d.acPower.toFixed(1));
  client.publish('/App/Garage/modbus/DC power', d.dcPower.toFixed(1));
  client.publish('/App/Garage/modbus/energy', (d.energy/1000).toFixed(1));
}

function makeInfoString(resp) {
  var s = `${resp.manufacturer} ${resp.model} ${resp.option} ${resp.version} ${resp.serialNumber}`;
  console.log(s);
  return s;
}

function decodeInverterData(data) {
  var o = {};
  var resp = responseInverterData.fields;
  responseInverterData._setBuff(data);
  //console.log(data)
  o.acCurrent = resp.current * Math.pow(10, resp.current_SF);
  o.acVoltage = resp.voltage * Math.pow(10, resp.voltage_SF);
  o.acPower = resp.power * Math.pow(10, resp.power_SF);
  o.frequency = resp.frequency * Math.pow(10, resp.frequency_SF);
  o.VA = resp.VA * Math.pow(10, resp.VA_SF);
  o.VAR = resp.VAR * Math.pow(10, resp.VAR_SF);
  o.PF = resp.PF * Math.pow(10, resp.PF_SF);
  o.energy = resp.energy * Math.pow(10, resp.energy_SF);
  o.dcCurrent = resp.DC_current * Math.pow(10, resp.DC_current_SF);
  o.dcVoltage = resp.DC_voltage * Math.pow(10, resp.DC_voltage_SF);
  o.dcPower = resp.DC_power * Math.pow(10, resp.DC_power_SF);
  o.temp = resp.temp * Math.pow(10, resp.temp_SF);
  o.state = resp.state;
  o.status = resp.status;
  return o;
};

function decodeMeterData(data) {
  var o = {};
  var resp = responseMeterData.fields;
  responseMeterData._setBuff(data);
  //console.log(data)
  o.acCurrent = resp.current * Math.pow(10, resp.current_SF);
  o.acVoltage = resp.voltage * Math.pow(10, resp.voltage_SF);
  o.acPower = resp.power * Math.pow(10, resp.power_SF);
  o.frequency = resp.frequency * Math.pow(10, resp.frequency_SF);
  o.VA = resp.VA * Math.pow(10, resp.VA_SF);
  o.VAR = resp.VAR * Math.pow(10, resp.VAR_SF);
  o.PF = resp.PF * Math.pow(10, resp.PF_SF);
  o.energy = resp.energy * Math.pow(10, resp.energy_SF);
  o.dcCurrent = resp.DC_current * Math.pow(10, resp.DC_current_SF);
  o.dcVoltage = resp.DC_voltage * Math.pow(10, resp.DC_voltage_SF);
  o.dcPower = resp.DC_power * Math.pow(10, resp.DC_power_SF);
  o.temp = resp.temp * Math.pow(10, resp.temp_SF);
  o.state = resp.state;
  o.status = resp.status;
  return o;
};

