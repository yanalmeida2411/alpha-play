export interface Card {
  id: string;
  letter: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface MemoryGameProps {
  childId: string;
}

export type GameLevel = 1 | 2 | 3;
