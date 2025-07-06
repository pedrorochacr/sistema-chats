import amqp from "amqplib";

export const RABBITMQ_URI = process.env.RABBITMQ_URI || "amqp://localhost";
export const RABBITMQ_PREFETCH = parseInt(process.env.RABBITMQ_PREFETCH || "1", 10);