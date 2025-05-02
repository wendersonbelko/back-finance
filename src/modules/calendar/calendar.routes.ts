import { FastifyInstance } from "fastify";
import { createCalendarController, getCalendarController, getCalendarsController } from "./canlendar.controller";

export async function calendarRoutes(fastify: FastifyInstance) {
  // Busca todas as agendas
  fastify.get(
    '/:walletId',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            walletId: { type: 'number' },
          },
        },
        querystring: {
          type: 'object',
          properties: {
            start: { type: 'string', format: 'date-time' },
            end: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    getCalendarsController
  );

  // Busca uma agenda pelo ID
  fastify.get('/:walletId/:id', getCalendarController);

  // Cria uma nova agenda
  fastify.post(
    '/:walletId',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            walletId: { type: 'number' },
          },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            startDateTime: { type: 'string', format: 'date-time' },
            endDateTime: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    createCalendarController
  );
}