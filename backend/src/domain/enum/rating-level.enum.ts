export enum RatingLevel {
  VERY_POOR = 1,
  POOR = 2,
  AVERAGE = 3,
  GOOD = 4,
  EXCELLENT = 5
}

export const RATING_LABELS: Record<RatingLevel, string> = {
  [RatingLevel.VERY_POOR]: 'Very Poor',
  [RatingLevel.POOR]: 'Poor',
  [RatingLevel.AVERAGE]: 'Average',
  [RatingLevel.GOOD]: 'Good',
  [RatingLevel.EXCELLENT]: 'Excellent'
}; 