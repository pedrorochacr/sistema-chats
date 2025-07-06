export default function convertInstanceStatus(status: string){
    let convertedStatus: string;

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