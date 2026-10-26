// The top card in a column has the smallest position
const STEP = 1;
// Halving a gap this small stops giving distinct numbers, so the column gets renumbered
const MIN_GAP = 1e-6;

export function positionBetween(above?: number, below?: number) {
  if (above === undefined) return below === undefined ? STEP : below - STEP;
  if (below === undefined) return above + STEP;
  return (above + below) / 2;
}

export function hasRoom(above?: number, below?: number) {
  return above === undefined || below === undefined || below - above > MIN_GAP;
}
