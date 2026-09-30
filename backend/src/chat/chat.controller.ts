import { Body, Controller, Get, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatRequestDto } from "./dto/chat.dto";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("health")
  health() {
    return { status: "ok", service: "chat-agent" };
  }

  // Configuración pública del agente (sin secretos): nombre para el frontend.
  @Get("config")
  config() {
    return { agentName: this.chatService.getAgentName() };
  }

  @Post()
  async chat(@Body() body: ChatRequestDto) {
    const message = (body?.message || "").trim();
    if (!message) {
      return { reply: "Escribe un mensaje para que pueda ayudarte 🙂" };
    }
    const reply = await this.chatService.reply(message, body.history || []);
    return { reply };
  }
}
