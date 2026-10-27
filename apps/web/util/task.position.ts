// Mirrors positionBetween in the API so a dropped card can be placed before the server answers.
const STEP = 1;

export function positionBetween(above?: number, below?: number) {
  if (above === undefined) return below === undefined ? STEP : below - STEP;
  if (below === undefined) return above + STEP;
  return (above + below) / 2;
}
