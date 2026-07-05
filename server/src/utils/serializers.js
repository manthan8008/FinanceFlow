export function serializeUser(user) {
  return {
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    currency: user.currency,
    monthlyIncome: user.monthlyIncome,
    savingsGoal: user.savingsGoal,
    isDemo: user.isDemo,
  };
}

export function toObject(doc) {
  if (!doc) return doc;
  return doc.toObject ? doc.toObject() : doc;
}
