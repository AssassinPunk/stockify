export function calculateVixMoves(vixValue: number) {
  if (vixValue <= 0) {
    return { daily: 0, weekly: 0, monthly: 0, yearly: 0 };
  }
  const daily = vixValue / Math.sqrt(245);
  const weekly = vixValue / Math.sqrt(52);
  const monthly = vixValue / Math.sqrt(12);
  const yearly = vixValue; 

  return {
    daily,
    weekly,
    monthly,
    yearly,
  };
}
