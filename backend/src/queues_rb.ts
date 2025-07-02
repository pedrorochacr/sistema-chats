import * as Sentry from "@sentry/node";
import Queue from "bull";
import fs from "fs";
import { MessageData, SendMessage } from "./helpers/SendMessage";
import Whatsapp from "./models/Whatsapp";
import { logger } from "./utils/logger";
import moment from "moment";
import Schedule from "./models/Schedule";
import Contact from "./models/Contact";
import { Op, QueryTypes } from "sequelize";
import GetDefaultWhatsApp from "./helpers/GetDefaultWhatsApp";
import Campaign from "./models/Campaign";
import ContactList from "./models/ContactList";
import ContactListItem from "./models/ContactListItem";
import { isEmpty, isNil, isArray } from "lodash";
import CampaignSetting from "./models/CampaignSetting";
import CampaignShipping from "./models/CampaignShipping";
import GetWhatsappWbot from "./helpers/GetWhatsappWbot";
import sequelize from "./database";
import { getMessageOptions, processAudio, processAudioFile } from "./services/WbotServices/SendWhatsAppMedia";
import { getIO } from "./libs/socket";
import path from "path";
import User from "./models/User";
import Company from "./models/Company";
import Plan from "./models/Plan";
import SendInstanceMessageService from "./services/EvolutionApiService/SendInstanceMessageService";
import CampaignMessage from "./models/CampaignMessage";
import { log } from "console";
import SendMediaInstanceMessageService from "./services/EvolutionApiService/SendMediaMessageService";
import mime from "mime";
import * as amqp from "amqplib";
import SendAudioMessageService from "./services/EvolutionApiService/SendAudioMessageService";
import { RABBITMQ_URI } from "./config/rabbitmq";
const nodemailer = require('nodemailer');
const CronJob = require('cron').CronJob;

const connection = process.env.REDIS_URI || "";
const limiterMax = process.env.REDIS_OPT_LIMITER_MAX || 1;
const limiterDuration = process.env.REDIS_OPT_LIMITER_DURATION || 3000;


async function createRabbitMQChannel() {
  const connection = await amqp.connect(RABBITMQ_URI);
  const channel = await connection.createChannel();
  return channel;
}

// Cria uma fila no RabbitMQ
async function createQueue(channel: amqp.Channel, queueName: string, options: any = {}) {
  await channel.assertQueue(queueName, { durable: true, ...options });
  return queueName;
}

// Envia uma mensagem para uma fila
async function sendToQueue(channel: amqp.Channel, queueName: string, message: any) {
  const messageBuffer = Buffer.from(JSON.stringify(message));
  channel.sendToQueue(queueName, messageBuffer);
  logger.info(`Message sent to queue "${queueName}": ${message}`);
}

// Consome mensagens de uma fila
async function consumeFromQueue(channel: amqp.Channel, queueName: string, callback: (msg: any) => void) {
  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      const message = JSON.parse(msg.content.toString());
      callback(message);
      channel.ack(msg);
    }
  });
  logger.info(`Consuming messages from queue "${queueName}"`);
}

interface ProcessCampaignData {
  id: number;
  delay: number;
}

interface PrepareContactData {
  contactId: number;
  campaignId: number;
  delay: number;
  variables: any[];
}

interface DispatchCampaignData {
  campaignId: number;
  campaignShippingId: number;
  contactListItemId: number;
}
// const rabbitMQChannel = await createRabbitMQChannel();

// export const userMonitorQueue = await createQueue(rabbitMQChannel, "UserMonitor");
// export const messageQueue = await createQueue(rabbitMQChannel, "MessageQueue");
// export const scheduleMonitorQueue = await createQueue(rabbitMQChannel, "ScheduleMonitor");
// export const sendScheduledMessagesQueue = await createQueue(rabbitMQChannel, "SendScheduledMessages");
// export const campaignQueue = await createQueue(rabbitMQChannel, "CampaignQueue");

// Funções para enviar e consumir mensagens
// export const sendToUserMonitor = (data: any) => sendToQueue(rabbitMQChannel, userMonitorQueue, data);
// export const sendToMessageQueue = (data: any) => sendToQueue(rabbitMQChannel, messageQueue, data);
// export const sendToScheduleMonitor = (data: any) => sendToQueue(rabbitMQChannel, scheduleMonitorQueue, data);
// export const sendToScheduledMessages = (data: any) => sendToQueue(rabbitMQChannel, sendScheduledMessagesQueue, data);
// export const sendToCampaignQueue = (data: any) => sendToQueue(rabbitMQChannel, campaignQueue, data);

// export const consumeUserMonitor = (callback: (msg: any) => void) => consumeFromQueue(rabbitMQChannel, userMonitorQueue, callback);
// export const consumeMessageQueue = (callback: (msg: any) => void) => consumeFromQueue(rabbitMQChannel, messageQueue, callback);
// export const consumeScheduleMonitor = (callback: (msg: any) => void) => consumeFromQueue(rabbitMQChannel, scheduleMonitorQueue, callback);
// export const consumeScheduledMessages = (callback: (msg: any) => void) => consumeFromQueue(rabbitMQChannel, sendScheduledMessagesQueue, callback);
// export const consumeCampaignQueue = (callback: (msg: any) => void) => consumeFromQueue(rabbitMQChannel, campaignQueue, callback);
export const userMonitor = new Queue("UserMonitor", connection);


// export const messageQueue = new Queue("MessageQueue", connection, {
//   limiter: {
//     max: limiterMax as number,
//     duration: limiterDuration as number
//   }
// });

export const scheduleMonitor = new Queue("ScheduleMonitor", connection);
export const sendScheduledMessages = new Queue(
  "SendSacheduledMessages",
  connection
);

// export const campaignQueue = new Queue("CampaignQueue", connection);

async function handleSendMessage(job) {
  try {
    const { data } = job;

    const whatsapp = await Whatsapp.findByPk(data.whatsappId);

    if (whatsapp == null) {
      throw Error("Whatsapp não identificado");
    }

    const messageData: MessageData = data.data;

    await SendMessage(whatsapp, messageData);
  } catch (e: any) {
    Sentry.captureException(e);
    logger.error("MessageQueue -> SendMessage: error: "+ e.message);
    throw e;
  }
}

async function handleVerifySchedules(job) {
  try {
    const { count, rows: schedules } = await Schedule.findAndCountAll({
      where: {
        status: "PENDENTE",
        sentAt: null,
        sendAt: {
          [Op.gte]: moment().format("YYYY-MM-DD HH:mm:ss"),
          [Op.lte]: moment().add("30", "seconds").format("YYYY-MM-DD HH:mm:ss")
        }
      },
      include: [{ model: Contact, as: "contact" }]
    });
    if (count > 0) {
      schedules.map(async schedule => {
        await schedule.update({
          status: "AGENDADA"
        });
        sendScheduledMessages.add(
          "SendMessage",
          { schedule },
          { delay: 40000 }
        );
        logger.info(`Disparo agendado para: ${schedule.contact.name}`);
      });
    }
  } catch (e: any) {
    Sentry.captureException(e);
    logger.error("SendScheduledMessage -> Verify: error: "+ e.message);
    throw e;
  }
}

async function handleSendScheduledMessage(job) {
  const {
    data: { schedule }
  } = job;
  let scheduleRecord: Schedule | null = null;

  try {
    scheduleRecord = await Schedule.findByPk(schedule.id);
  } catch (e) {
    Sentry.captureException(e);
    logger.info(`Erro ao tentar consultar agendamento: `+schedule.id);
  }

  try {
    const whatsapp = await GetDefaultWhatsApp(schedule.companyId);

    await SendMessage(whatsapp, {
      number: schedule.contact.number,
      body: schedule.body
    });

    await scheduleRecord?.update({
      sentAt: moment().format("YYYY-MM-DD HH:mm"),
      status: "ENVIADA"
    });

    logger.info(`Mensagem agendada enviada para:`+schedule.contact.name);
    sendScheduledMessages.clean(15000, "completed");
  } catch (e: any) {
    Sentry.captureException(e);
    await scheduleRecord?.update({
      status: "ERRO"
    });
    logger.error("SendScheduledMessage -> SendMessage: error: "+ e.message);
    throw e;
  }
}

// async function handleVerifyCampaigns(job) {
//   /**
//    * @todo
//    * Implementar filtro de campanhas
//    */
//   const campaigns: { id: number; scheduledAt: string }[] =
//     await sequelize.query(
//       `select id, "scheduledAt" from "Campaigns" c
//     where "scheduledAt" between now() and now() + '1 hour'::interval and status = 'PROGRAMADA'`,
//       { type: QueryTypes.SELECT }
//     );
//   logger.info(`Campanhas encontradas: `+campaigns.length);
//   for (let campaign of campaigns) {
//     try {
//       const now = moment();
//       const scheduledAt = moment(campaign.scheduledAt);
//       const delay = scheduledAt.diff(now, "milliseconds");
//       logger.info(
//         `Campanha enviada para a fila de processamento: Campanha=`+campaign.id+`, Delay Inicial=`+delay);
//       campaignQueue.add(
//         "ProcessCampaign",
//         {
//           id: campaign.id,
//           delay
//         },
//         {
//           removeOnComplete: true
//         }
//       );
//     } catch (err: any) {
//       Sentry.captureException(err);
//     }
//   }
// }

async function getCampaign(id) {
  return await Campaign.findByPk(id, {
    include: [
      {
        model: ContactList,
        as: "contactList",
        attributes: ["id", "name"],
        include: [
          {
            model: ContactListItem,
            as: "contacts",
            attributes: ["id", "name", "number", "email", "isWhatsappValid"],
            where: { isWhatsappValid: true }
          }
        ]
      },
      {
        model: Whatsapp,
        as: "whatsapp",
        attributes: ["id", "name"]
      },
      {
        model: CampaignMessage,
        as: "messages",
        attributes: ["id", "message"]
      },
      {
        model: CampaignShipping,
        as: "shipping",
        include: [{ model: ContactListItem, as: "contact" }]
      }
    ]
  });
}

async function getContact(id) {
  return await ContactListItem.findByPk(id, {
    attributes: ["id", "name", "number", "email"]
  });
}

async function getSettings(campaign) {
  const settings = await CampaignSetting.findAll({
    where: { companyId: campaign.companyId },
    attributes: ["key", "value"]
  });

  let messageInterval: number = 20;
  let longerIntervalAfter: number = 20;
  let greaterInterval: number = 60;
  let variables: any[] = [];

  settings.forEach(setting => {
    if (setting.key === "messageInterval") {
      messageInterval = JSON.parse(setting.value);
    }
    if (setting.key === "longerIntervalAfter") {
      longerIntervalAfter = JSON.parse(setting.value);
    }
    if (setting.key === "greaterInterval") {
      greaterInterval = JSON.parse(setting.value);
    }
    if (setting.key === "variables") {
      variables = JSON.parse(setting.value);
    }
  });

  return {
    messageInterval,
    longerIntervalAfter,
    greaterInterval,
    variables
  };
}

export function parseToMilliseconds(seconds) {
  return seconds * 1000;
}

async function sleep(seconds) {
  logger.info(
    `Sleep de ${seconds} segundos iniciado: ${moment().format("HH:mm:ss")}`
  );
  return new Promise(resolve => {
    setTimeout(() => {
      logger.info(
        `Sleep de ${seconds} segundos finalizado: ${moment().format(
          "HH:mm:ss"
        )}`
      );
      resolve(true);
    }, parseToMilliseconds(seconds));
  });
}

function getCampaignValidMessages(campaignMessages: CampaignMessage[]) {
  const messages = [];
  for(const m of campaignMessages ){
    if (!isEmpty(m.message) && !isNil(m.message)) {
      messages.push(m.message)
    }
      
  }
  return messages;
}

function getCampaignValidConfirmationMessages(campaignMessages: CampaignMessage[]) {
  const messages = [];
  for(const m of campaignMessages ){
    if (!isEmpty(m.confirmationMessage) && !isNil(m.confirmationMessage)) {
      messages.push(m.confirmationMessage)
    }
      
  }
  return messages;

}

function getProcessedMessage(msg: string, variables: any[], contact: any) {
  let finalMessage = msg;

  if (finalMessage.includes("{nome}")) {
    finalMessage = finalMessage.replace(/{nome}/g, contact.name);
  }

  if (finalMessage.includes("{email}")) {
    finalMessage = finalMessage.replace(/{email}/g, contact.email);
  }

  if (finalMessage.includes("{numero}")) {
    finalMessage = finalMessage.replace(/{numero}/g, contact.number);
  }

  variables.forEach(variable => {
    if (finalMessage.includes(`{${variable.key}}`)) {
      const regex = new RegExp(`{${variable.key}}`, "g");
      finalMessage = finalMessage.replace(regex, variable.value);
    }
  });

  return finalMessage;
}

export function randomValue(min, max) {
  return Math.floor(Math.random() * max) + min;
}

async function verifyAndFinalizeCampaign(campaign) {
  const { contacts } = campaign.contactList;

  const count1 = contacts.length;
  const count2 = await CampaignShipping.count({
    where: {
      campaignId: campaign.id,
      deliveredAt: {
        [Op.not]: null
      }
    }
  });

  if (count1 === count2) {
    await campaign.update({ status: "FINALIZADA", completedAt: moment() });
  }

  const io = getIO();
  io.emit(`company-${campaign.companyId}-campaign`, {
    action: "update",
    record: campaign
  });
}

// async function handleProcessCampaign(job) {
//   try {
//     const { id }: ProcessCampaignData = job.data;
//     let { delay }: ProcessCampaignData = job.data;
//     console.log("entrou processamento de campanha");
//     const campaign = await getCampaign(id);
//     const settings = await getSettings(campaign);
//     if (campaign) {
//       const { contacts } = campaign.contactList;
//       if (isArray(contacts)) {
//         let index = 0;
//         for (let contact of contacts) {
//           campaignQueue.add(
//             "PrepareContact",
//             {
//               contactId: contact.id,
//               campaignId: campaign.id,
//               variables: settings.variables,
//               delay: delay || 0
//             },
//             {
//               removeOnComplete: true
//             }
//           );

//           logger.info(
//             `Registro enviado pra fila de disparo: Campanha=${campaign.id};Contato=${contact.name};delay=${delay}`
//           );
//           index++;
//           if (index > campaign.maxIntervalMessages) {
//             //intervalo maior após intervalo configurado de mensagens
//             delay += parseToMilliseconds(
//               randomValue(campaign.afterIntervalMin, campaign.afterIntervalMax)
//             );
//           } else {
//             delay += parseToMilliseconds(
//               randomValue(campaign.initialIntervalMin, campaign.initialIntervalMax)
//             );
//           }
//         }
//         await campaign.update({ status: "EM_ANDAMENTO" });
//       }
//     }
//   } catch (err: any) {
//     Sentry.captureException(err);
//   }
// }

// async function handlePrepareContact(job) {
//   try {
//     const { contactId, campaignId, delay, variables }: PrepareContactData =
//       job.data;
//     const campaign = await getCampaign(campaignId);
//     const contact = await getContact(contactId);

//     const campaignShipping: any = {};
//     campaignShipping.number = contact.number;
//     campaignShipping.contactId = contactId;
//     campaignShipping.campaignId = campaignId;

//     const messages = getCampaignValidMessages(campaign.messages);
//     if (messages.length) {
//       const radomIndex = randomValue(0, messages.length);
//       const message = getProcessedMessage(
//         messages[radomIndex],
//         variables,
//         contact
//       );
//       campaignShipping.message = `\u200c${message}`;
//     }

//     if (campaign.confirmation) {
//       const confirmationMessages =
//         getCampaignValidConfirmationMessages(campaign.messages);
//       if (confirmationMessages.length) {
//         const radomIndex = randomValue(0, confirmationMessages.length);
//         const message = getProcessedMessage(
//           confirmationMessages[radomIndex],
//           variables,
//           contact
//         );
//         campaignShipping.confirmationMessage = `\u200c${message}`;
//       }
//     }

//     const [record, created] = await CampaignShipping.findOrCreate({
//       where: {
//         campaignId: campaignShipping.campaignId,
//         contactId: campaignShipping.contactId
//       },
//       defaults: campaignShipping
//     });

//     if (
//       !created &&
//       record.deliveredAt === null &&
//       record.confirmationRequestedAt === null
//     ) {
//       record.set(campaignShipping);
//       await record.save();
//     }

//     if (
//       record.deliveredAt === null &&
//       record.confirmationRequestedAt === null
//     ) {
//       const nextJob = await campaignQueue.add(
//         "DispatchCampaign",
//         {
//           campaignId: campaign.id,
//           campaignShippingId: record.id,
//           contactListItemId: contactId
//         },
//         {
//           delay
//         }
//       );

//       await record.update({ jobId: nextJob.id });
//     }

//     await verifyAndFinalizeCampaign(campaign);
//   } catch (err: any) {
//     Sentry.captureException(err);
//     logger.error(`campaignQueue -> PrepareContact -> error: ${err.message}`);
//   }
// }

async function handleDispatchCampaign(job) {
  try {
    const { data } = job;
    const { campaignShippingId, campaignId }: DispatchCampaignData = data;
    const campaign = await getCampaign(campaignId);
    //const wbot = await GetWhatsappWbot(campaign.whatsapp);

    const evolutionConnections = campaign.whatsapps.split(',');
    const radomIndex = randomValue(0, evolutionConnections.length);

   
    console.log("radomIndex  ",radomIndex)
    const randomConnection = evolutionConnections[radomIndex];
    logger.info(
      `Disparo de campanha solicitado: Campanha=${campaignId};Registro=${campaignShippingId}`
    );

    const campaignShipping = await CampaignShipping.findByPk(
      campaignShippingId,
      {
        include: [{ model: ContactListItem, as: "contact" }]
      }
    );

    const chatId = `${campaignShipping.number}@s.whatsapp.net`;

    if (campaign.confirmation && campaignShipping.confirmation === null) {
       console.log("Confirmation")
      // await wbot.sendMessage(chatId, {
      //   text: campaignShipping.confirmationMessage
      // });
      await campaignShipping.update({ confirmationRequestedAt: moment() });
    } else {
       
      if (campaign.mediaPath) {
        logger.info("Envio de midia Campanha");

        const filePath = path.resolve("public", campaign.mediaPath);
        const mediaName = campaign.mediaName
        const mimeType = mime.lookup(filePath);
        let typeMessage = mimeType.split("/")[0];
        let dataMessage;
        let options;
        // let  options = {
        //   delay: 0,
        //   presence: "composing"
        // };
        let buffer = fs.readFileSync(filePath).toString('base64');
        dataMessage = {
          number: campaignShipping.number,
          options,
          mediaMessage: {
              mediatype: typeMessage,
              caption: campaignShipping.message,
              media: buffer
         }
        }


        if(typeMessage === "audio"){
            const typeAudio = mediaName.includes("audio-record-site");
            let convert;
            if (typeAudio) {
              convert = await processAudio(filePath);
            } else {
              convert = await processAudioFile(filePath);
            }
            buffer = fs.readFileSync(convert).toString('base64');
            options = {
              delay: 0,
              presence:"recording",
              encoding: true
            };
            dataMessage ={
              number: `${campaignShipping.number}@s.whatsapp.net"}`,
              options,
              audioMessage: {
                audio: buffer,
                caption: campaignShipping.message,
              }
          }
            console.log("dataMessage ",dataMessage);
            await SendAudioMessageService(dataMessage, randomConnection);
            return ;

        }
         else if (typeMessage === "document" || typeMessage === "text") {
         
          options = {
            document: fs.readFileSync(filePath),
            fileName: mediaName,
            mimetype: mimeType
          };
         } else if (typeMessage === "application") {
            typeMessage = "document"
    
        } 
        options = {
            delay: 0,
            presence: "composing"
        };
         buffer = fs.readFileSync(filePath).toString('base64');
         dataMessage = {
          number:campaignShipping.number,
          options,
          mediaMessage: {
             mediatype: typeMessage,
             caption: campaignShipping.message,
             media: buffer
          }
       }
         if(typeMessage !=="image"){
            dataMessage.mediaMessage.fileName = mediaName;
         }
        await SendMediaInstanceMessageService(dataMessage,randomConnection)
        // if (Object.keys(options).length) {
        //   await wbot.sendMessage(chatId, { ...options });
        // }
      }
      else{
        console.log("Entrou Envio de mensagem da campanha", randomConnection)
        const options = {
          delay: 0,
          presence: "composing"
        };
      
        const textMessage ={
          text : campaignShipping.message
        }
        const dataMessage ={
            number: campaignShipping.number,
            options,
            textMessage
        }
        await SendInstanceMessageService(dataMessage, randomConnection)
        // await wbot.sendMessage(chatId, {
        //   text: campaignShipping.message
        // });
      }
      await campaignShipping.update({ deliveredAt: moment() });
    }

    await verifyAndFinalizeCampaign(campaign);

    const io = getIO();
    io.emit(`company-${campaign.companyId}-campaign`, {
      action: "update",
      record: campaign
    });

    logger.info(
      `Campanha enviada para: Campanha=${campaignId};Contato=${campaignShipping.contact.name}`
    );
  } catch (err: any) {
    Sentry.captureException(err);
    logger.error(err.message);
    console.log(err.stack);
  }
}

async function handleLoginStatus(job) {
  const users: { id: number }[] = await sequelize.query(
    `select id from "Users" where "updatedAt" < now() - '5 minutes'::interval and online = true`,
    { type: QueryTypes.SELECT }
  );
  for (let item of users) {
    try {
      const user = await User.findByPk(item.id);
      await user.update({ online: false });
      logger.info(`Usuário passado para offline: ${item.id}`);
    } catch (e: any) {
      Sentry.captureException(e);
    }
  }
}


async function handleInvoiceCreate() {
  const job = new CronJob('0 * * * * *', async () => {


    const companies = await Company.findAll();
    companies.map(async c => {
      var dueDate = c.dueDate;
      const date = moment(dueDate).format();
      const timestamp = moment().format();
      const hoje = moment(moment()).format("DD/MM/yyyy");
      var vencimento = moment(dueDate).format("DD/MM/yyyy");

      var diff = moment(vencimento, "DD/MM/yyyy").diff(moment(hoje, "DD/MM/yyyy"));
      var dias = moment.duration(diff).asDays();

      if (dias < 20) {
        const plan = await Plan.findByPk(c.planId);

        const sql = `SELECT COUNT(*) mycount FROM "Invoices" WHERE "companyId" = ${c.id} AND "dueDate"::text LIKE '${moment(dueDate).format("yyyy-MM-DD")}%';`
        const invoice = await sequelize.query(sql,
          { type: QueryTypes.SELECT }
        );
        if (invoice[0]['mycount'] > 0) {
          
        } else {
          const sql = `INSERT INTO "Invoices" (detail, status, value, "updatedAt", "createdAt", "dueDate", "companyId")
          VALUES ('${plan.name}', 'open', '${plan.value}', '${timestamp}', '${timestamp}', '${date}', ${c.id});`

          const invoiceInsert = await sequelize.query(sql,
            { type: QueryTypes.INSERT }
          );

/*           let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'email@gmail.com',
              pass: 'senha'
            }
          });

          const mailOptions = {
            from: 'heenriquega@gmail.com', // sender address
            to: `${c.email}`, // receiver (use array of string for a list)
            subject: 'Fatura gerada - Sistema', // Subject line
            html: `Olá ${c.name} esté é um email sobre sua fatura!<br>
<br>
Vencimento: ${vencimento}<br>
Valor: ${plan.value}<br>
Link: ${process.env.FRONTEND_URL}/financeiro<br>
<br>
Qualquer duvida estamos a disposição!
            `// plain text body
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if (err)
              console.log(err)
            else
              console.log(info);
          }); */

        }





      }

    });
  });
  job.start()
}


handleInvoiceCreate()

// export async function startQueueProcess() {
//   logger.info("Iniciando processamento de filas");

//   messageQueue.process("SendMessage", handleSendMessage);

//   scheduleMonitor.process("Verify", handleVerifySchedules);

//   sendScheduledMessages.process("SendMessage", handleSendScheduledMessage);

//   campaignQueue.process("VerifyCampaignsDaatabase", handleVerifyCampaigns);

//   campaignQueue.process("ProcessCampaign", handleProcessCampaign);

//   campaignQueue.process("PrepareContact", handlePrepareContact);

//   campaignQueue.process("DispatchCampaign", handleDispatchCampaign);

//   userMonitor.process("VerifyLoginStatus", handleLoginStatus);




//   scheduleMonitor.add(
//     "Verify",
//     {},
//     {
//       repeat: { cron: "*/5 * * * * *" },
//       removeOnComplete: true
//     }
//   );

//   campaignQueue.add(
//     "VerifyCampaignsDaatabase",
//     {},
//     {
//       repeat: { cron: "*/20 * * * * *" },
//       removeOnComplete: true
//     }
//   );

//   userMonitor.add(
//     "VerifyLoginStatus",
//     {},
//     {
//       repeat: { cron: "* * * * *" },
//       removeOnComplete: true
//     }
//   );
// }
