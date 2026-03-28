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

export function getRiskLevel(vixValue: number): { level: 'Low' | 'Moderate' | 'High' | 'Extreme'; color: string } {
  if (vixValue < 13) return { level: 'Low', color: 'text-up' };
  if (vixValue < 18) return { level: 'Moderate', color: 'text-yellow-500' };
  if (vixValue < 25) return { level: 'High', color: 'text-orange-500' };
  return { level: 'Extreme', color: 'text-down' };
}
