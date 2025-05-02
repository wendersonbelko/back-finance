import { FastifyReply, FastifyRequest } from "fastify";
import { createCalendar, getCalendarById, getCalendars } from "./calendar.service";
import { Calendar } from "@prisma/client";


export async function getCalendarsController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { start, end } = request.query as { start: Date; end: Date };
    const { walletId } = request.params as { walletId: number };
    const calendars = await getCalendars(start, end, walletId);
    reply.send({ calendars });
  } catch (error: any) {
    reply.code(400).send({ error: error.message });
  }
}

export async function getCalendarController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const calendar = await getCalendarById(parseInt(id));
    if (!calendar) {
      reply.code(404).send({ error: "Agenda não encontrada" });
    } else {
      reply.send({ calendar });
    }
  } catch (error: any) {
    reply.code(400).send({ error: error.message });
  }
}

export async function createCalendarController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { walletId } = request.params as { walletId: number };
    const payload = request.body as Calendar;
    const calendar = await createCalendar({ ...payload, walletId });
    reply.send({ calendar });
  } catch (error: any) {
    reply.code(400).send({ error: error.message });
  }
}