export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export class ChatRequestDto {
  message: string;
  history?: ChatMessage[];
}

export class ProfileRecommendDto {
  // Mapa de respuestas: { questionId: optionValue }
  answers: Record<string, string>;
}
