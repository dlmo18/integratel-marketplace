import { Body, Controller, Get, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ProfileService } from "./profile.service";
import { ChatRequestDto, ProfileRecommendDto } from "./dto/chat.dto";

@Controller("chat")
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly profileService: ProfileService
  ) {}

  @Get("health")
  health() {
    return { status: "ok", service: "chat-agent" };
  }

  // Configuración pública del agente (sin secretos): nombre para el frontend.
  @Get("config")
  config() {
    return { agentName: this.chatService.getAgentName() };
  }

  // Set de preguntas para perfilar al cliente.
  @Get("profile/questions")
  profileQuestions() {
    return { questions: this.profileService.getQuestions() };
  }

  // Recibe las respuestas del cuestionario y devuelve productos recomendados
  // junto con un mensaje personalizado del asistente.
  @Post("profile/recommend")
  async profileRecommend(@Body() body: ProfileRecommendDto) {
    const answers = body?.answers || {};
    const products = this.profileService.recommend(answers);
    const summary = this.profileService.describeProfile(answers);
    const message = await this.chatService.profileMessage(
      summary,
      products.map((p) => ({ name: p.name, price: p.price, reason: p.reason }))
    );
    return { message, summary, products };
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
