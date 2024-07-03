export interface Message {
  from: MessageType;
  message: string;
  image?: string;
}

type MessageType = "YOU" | "AI";
