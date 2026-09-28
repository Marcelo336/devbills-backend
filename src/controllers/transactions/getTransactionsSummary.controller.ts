// src/controllers/transactions/getTransactionsSummary.controller.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../../config/prisma.js";
import { GetTransactionSummaryQuery } from "../../schemas/transaction.schema.js";
import { CategorySummary } from "../../types/category.types.js";
import { TransactionType } from "@prisma/client";
import { TransactionSummary } from "../../types/transaction.types.js";
dayjs.extend(utc);

export const getTransactionsSummary = async (
    request: FastifyRequest<{ Querystring: GetTransactionSummaryQuery }>,
    reply: FastifyReply,
  ): Promise<void> => {

    const userId = request.userId;

    // --- LOGS DE DIAGNÓSTICO CRÍTICO ---
    request.log.info({ message: "DEBUG: getTransactionsSummary chamado", userId: userId });
    // --- FIM LOGS DE DIAGNÓSTICO ---

    if (!userId) {
      return reply.status(401).send({ error: "Usuário não autenticado" });
    }

    const { month, year } = request.query;

    // --- LOGS DE DIAGNÓSTICO CRÍTICO ---
    request.log.info({ message: "DEBUG: Query params", month: month, year: year });
    // --- FIM LOGS DE DIAGNÓSTICO ---

    if (!month || !year) {
      return reply.status(400).send({ error: "Mês e ano são obrigatórios" });
    }

    const startDate = dayjs.utc(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = dayjs.utc(startDate).endOf('month').toDate();

    // --- LOGS DE DIAGNÓSTICO CRÍTICO ---
    request.log.info({ message: "DEBUG: Date range", startDate: startDate.toISOString(), endDate: endDate.toISOString() });
    // --- FIM LOGS DE DIAGNÓSTICO ---

    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          category: true,
        },
      });

      // --- LOGS DE DIAGNÓSTICO CRÍTICO ---
      request.log.info({ message: "DEBUG: Transactions found", count: transactions.length, firstTransaction: transactions.length > 0 ? transactions[0] : null });
      // --- FIM LOGS DE DIAGNÓSTICO ---

      let totalExpenses = 0;
      let totalIncomes = 0;
      const groupedExpenses = new Map<string, CategorySummary>();

      for (const transaction of transactions) {
        if (transaction.type === TransactionType.expense) {
          const existing = groupedExpenses.get(transaction.categoryId) ?? {
            categoryId: transaction.categoryId,
            categoryName: transaction.category.name,
            categoryColor: transaction.category.color,
            amount: 0,
            percentage: 0,
          };

          existing.amount += transaction.amount;
          groupedExpenses.set(transaction.categoryId, existing);

          totalExpenses += transaction.amount;
        } else if (transaction.type === TransactionType.income) { // MUDANÇA: Adicionado verificação explícita para income
          totalIncomes += transaction.amount;
        }
        // Se houver outros tipos, eles seriam ignorados ou tratados aqui
      }

      const summary: TransactionSummary = {
        totalExpenses,
        totalIncomes,
        balance: Number((totalIncomes - totalExpenses).toFixed(2)),
        expenseByCategory: Array.from(groupedExpenses.values()).map((entry) => ({
          ...entry,
          // MUDANÇA: Prevenir divisão por zero para percentage
          percentage: totalExpenses > 0 ? Number.parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2)) : 0
        })) .sort((a, b) => b.amount - a.amount),
      };

      // --- LOGS DE DIAGNÓSTICO CRÍTICO ---
      request.log.info({ message: "DEBUG: Summary calculated", summary: summary });
      // --- FIM LOGS DE DIAGNÓSTICO ---

      reply.send(summary);
    } catch (err: unknown) {
      if (err instanceof Error) {
        request.log.error({ message: err.message, stack: err.stack }, "Erro ao trazer transações");
      } else {
        request.log.error({ err }, "Erro desconhecido ao trazer transações");
      }
      reply.status(500).send({ error: "Erro do servidor" });
    }
  };