export interface ChildProfile {
  _id: string;
  name: string;
  birthDate: string;
  avatar: string;
  responsibleId: string;
  totalStars?: number;
  totalTimePlayed?: number;
  consecutiveDays?: number;
  lastActivity?: string;
  streakDays?: number;
  streakBroken?: boolean;
  level?: number;
  progress?: number;
}

export interface GamePlayed {
  name: string;
  timePlayed: number;
  successCount: number;
  errorCount: number;
  plays: number;
}

export interface ChildPlayedTime {
  name: string;
  totalStars: number;
  games: GamePlayed[];
}

export interface PlayedTimeResponse {
  children: ChildPlayedTime[];
  rankingGlobalGames: { name: string; plays: number }[];
}

export interface UserProfile {
  _id: string;
  name: string;
  surname: string;
  email: string;
  termsAccepted: boolean;
  childIds?: string | string[];
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface CustomJwtPayload {
  sub?: string;
  id?: string;
  _id?: string;
}

export interface ChildFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "CREATE" | "UPDATE";
  initialData?: ChildProfile | null;
  avatarMap: Record<string, string>;
  onSubmit: (formData: FormData) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export interface ProfileListProps {
  childrenData: ChildProfile[];
  onAdd: () => void;
  onEdit: (child: ChildProfile) => void;
  avatarMap: Record<string, string>;
}

export interface ProfileManagerProps {
  childrenData?: ChildProfile[];
}
