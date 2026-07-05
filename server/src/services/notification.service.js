import { Notification } from "../models/Notification.js";

export async function createNotification(user, payload) {
  return Notification.create({ user: user._id, ...payload });
}

export async function notifyLargeExpense(user, expense) {
  if (Number(expense.amount) < 10000) return;
  await createNotification(user, {
    type: "large_expense",
    title: "Large expense recorded",
    message: `${expense.title} was recorded for ${expense.amount}.`,
  });
}

export async function notifyGoalReached(user, goal) {
  if (Number(goal.currentAmount) < Number(goal.targetAmount)) return;
  await createNotification(user, {
    type: "goal",
    title: "Financial goal reached",
    message: `${goal.name} has reached its target amount.`,
  });
}
