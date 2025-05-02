import { Calendar, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// pega todas as agendas de acordo com as datas start e end recebidas (validar hora e datas)
export async function getCalendars(start: Date, end: Date, walletId: number) {
  return prisma.calendar.findMany({
    where: {
      startDate: {
        gte: start,
      },
      endDate: {
        lte: end,
      },
      deletedAt: null,
      walletId,
    },
  });
}
// pega uma agenda pelo id
export async function getCalendarById(id: number) {
  return prisma.calendar.findUnique({
    where: {
      id,
    },
  });
}
// cria uma nova agenda
export async function createCalendar(payload: Calendar) {
  return prisma.calendar.create({
    data: {
      ...payload,
    },
  });
}