export interface LetterItem {
  id: string;
  color: string;
}

export interface DropZoneItem {
  id: string;
  correctLetter: string;
  placedLetter: LetterItem | null;
  status: "correct" | "incorrect" | "idle";
}
