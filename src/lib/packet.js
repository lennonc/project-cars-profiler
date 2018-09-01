"use strict";

function decodeTelemetry(packet, callback) {
  let telemetry = {
    header: "header",
    data: {}
  }
}

function sneak (content, callback) {
  let peek = {
    header: {
      mPacketNumber: content.readUInt16LE(0),
      mCategoryNumber: content.readUInt16LE(4),
      mPartialPacketIndex: content[8],
      mPartialPacketNumber: content[9],
      mPacketType: content[10],
      mPacketVersion: content[11],
    }
  }

  console.log('====================================');
  console.log(peek);
  console.log('====================================');
}

module.exports = {
  sneak
}
