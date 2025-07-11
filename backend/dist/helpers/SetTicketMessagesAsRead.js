"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("../libs/cache");
const socket_1 = require("../libs/socket");
const Message_1 = __importDefault(require("../models/Message"));
const logger_1 = require("../utils/logger");
const SetTicketMessagesAsRead = async (ticket) => {
    await ticket.update({ unreadMessages: 0 });
    await cache_1.cacheLayer.set(`contacts:${ticket.contactId}:unreads`, "0");
    try {
        //const wbot = await GetTicketWbot(ticket);
        const getJsonMessage = await Message_1.default.findAll({
            where: {
                ticketId: ticket.id,
                fromMe: false,
                read: false
            },
            order: [["createdAt", "DESC"]]
        });
        console.log("entrou aqui");
        if (getJsonMessage.length > 0) {
            const lastMessages = JSON.parse(JSON.stringify(getJsonMessage[0].dataJson));
            // if (lastMessages.key && lastMessages.key.fromMe === false) {
            //   await (wbot as WASocket).chatModify(
            //     { markRead: true, lastMessages: [lastMessages] },
            //     `${ticket.contact.number}@${
            //       ticket.isGroup ? "g.us" : "s.whatsapp.net"
            //     }`
            //   );
            // }
        }
        await Message_1.default.update({ read: true }, {
            where: {
                ticketId: ticket.id,
                read: false
            }
        });
    }
    catch (err) {
        console.log(err);
        logger_1.logger.warn(`Could not mark messages as read. Maybe whatsapp session disconnected? Err: ${err}`);
    }
    const io = (0, socket_1.getIO)();
    io.to(ticket.status).to("notification").emit("ticket", {
        action: "updateUnread",
        ticketId: ticket.id
    });
    io.emit(`company-${ticket.companyId}-appMessage`, {
        action: "updateUnreadMessage",
        ticket
    });
};
exports.default = SetTicketMessagesAsRead;
//# sourceMappingURL=SetTicketMessagesAsRead.js.map