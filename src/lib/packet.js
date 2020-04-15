"use strict";
const { unsignedClamp, signedClamp } = require("./raceMath");

function decodeTelemetry(packet, callback) {
  let telemetry = {
    header: packet.header,
    data: {
      sViewedParticipantIndex: signedClamp(packet.data.sViewedParticipantIndex, 127),
      sUnfilteredThrottle: unsignedClamp(packet.data.sUnfilteredThrottle, 255),
      sUnfilteredBrake: unsignedClamp(packet.data.sUnfilteredBrake, 255),
      sUnfilteredSteering: signedClamp(packet.data.sUnfilteredSteering, 127),
      sUnfilteredClutch: unsignedClamp(packet.data.sUnfilteredClutch, 255),

      // Car State
      sCarFlags: packet.data.sCarFlags,
      sOilTempCelcius: packet.data.sOilTempCelcius,
      sOilPressureKPa: packet.data.sOilPressureKPa,
      sWaterTempCelsius: packet.data.sWaterTempCelsius,
      sWaterPressureKpa: packet.data.sWaterPressureKpa,
      sFuelPressureKpa: packet.data.sFuelPressureKpa,
      sFuelCapacity: packet.data.sFuelCapacity,
      sBrake: packet.data.sBrake,
      sThrottle: packet.data.sThrottle,
      sClutch: packet.data.sClutch,
      sFuelLevel: packet.data.sFuelCapacity * packet.data.sFuelLevel,
      sSpeed: packet.data.sSpeed,
      sRpm: packet.data.sRpm,
      sMaxRpm: packet.data.sMaxRpm,
      sSteering: packet.data.sSteering,
      sGearNumGears: packet.data.sGearNumGears.toString(16),
      sBoostAmount: packet.data.sBoostAmount,
      sCrashState: packet.data.sCrashState,
    }
  };

  console.log('====================================');
  console.log(telemetry);
  console.log('====================================');
  
}

let Packet = {
  "0": function(peek, callback) {
    let packet = {
      header: peek.header,
      data: {
        // Participant Index
        sViewedParticipantIndex: peek.payload.readInt8(12),
        sUnfilteredThrottle: peek.payload.readUInt8(13),
        sUnfilteredBrake: peek.payload.readUInt8(14),
        sUnfilteredSteering: peek.payload.readUInt8(15),
        sUnfilteredClutch: peek.payload.readUInt8(16),

        // Car State
        sCarFlags: peek.payload.readUInt8(17),
        sOilTempCelcius: peek.payload.readUInt8(18),
        sOilPressureKPa: peek.payload.readUInt16LE(20),
        sWaterTempCelsius: peek.payload.readInt16LE(22),
        sWaterPressureKpa: peek.payload.readUInt16LE(24),
        sFuelPressureKpa: peek.payload.readUInt16LE(26),
        sFuelCapacity: peek.payload.readUInt8(28),
        sBrake: peek.payload.readUInt8(29),
        sThrottle: peek.payload.readUInt8(30),
        sClutch: peek.payload.readUInt8(31),
        sFuelLevel: peek.payload.readFloatLE(32),
        sSpeed: peek.payload.readFloatLE(36),
        sRpm: peek.payload.readUInt16LE(40),
        sMaxRpm: peek.payload.readUInt16LE(42),
        sSteering: peek.payload.readInt8(44),
        sGearNumGears: peek.payload.readUInt8(45),
        sBoostAmount: peek.payload.readUInt8(46),
        sCrashState: peek.payload.readUInt8(47),
        
        sOdometerKM: peek.payload.readFloatLE(48),
        sOrientation: peek.payload.readFloatLE(52), // TODO: This is an array of 3 floats. Need to parse this properly
      }
    };
    decodeTelemetry(packet, callback)
  } 
  
}

function sneak (content, callback) {
  let peek = {
    header: {
      mPacketNumber: content.readUInt32LE(0),
      mCategoryNumber: content.readUInt32LE(4),
      mPartialPacketIndex: content.readUInt8(8),
      mPartialPacketNumber: content.readUInt8(9),
      mPacketType: content.readUInt8(10),
      mPacketVersion: content.readUInt8(11),
    },
    payload: content
  };

  console.log('====================================');
  console.log(peek);
  console.log('====================================');
  
  if (peek.header.mPacketType === 0)  {

    Packet[peek.header.mPacketType](peek, callback);
  }
  
}

module.exports = {
  sneak
}
