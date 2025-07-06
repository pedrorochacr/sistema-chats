"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertInstanceStatus(status) {
    let convertedStatus;
    switch (status) {
        case 'close':
            convertedStatus = 'DISCONNECTED';
            break;
        case 'open':
            convertedStatus = 'CONNECTED';
            break;
        case 'connecting':
            convertedStatus = 'OPENING';
            break;
        case 'disconnecting':
            convertedStatus = 'DISCONNECTING';
            break;
        case 'refused':
            convertedStatus = 'DISCONNECTED';
            break;
        default:
            convertedStatus = 'UNKNOWN';
            break;
    }
    return convertedStatus;
}
exports.default = convertInstanceStatus;
//# sourceMappingURL=convertInstanceStatus.js.map