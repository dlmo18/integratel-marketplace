import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { ChatMessage } from "./dto/chat.dto";
import { CATALOG_SUMMARY } from "./catalog-context";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private client: OpenAI | null = null;
  private readonly model: string;
  private readonly provider: string;
  private readonly agentName: string;

  constructor(private readonly config: ConfigService) {
    this.provider = this.config.get<string>("AI_PROVIDER") || "openai";
    this.model = this.config.get<string>("AI_MODEL") || "gpt-4o-mini";
    this.agentName = (this.config.get<string>("AI_SYSTEM_NAME") || "Asistente").trim();

    const apiKey = this.config.get<string>("AI_API_KEY");
    if (this.isValidKey(apiKey)) {
      this.client = new OpenAI({ apiKey });
      this.logger.log(`Agente IA activo (modelo ${this.model}).`);
    } else {
      this.logger.warn(
        "AI_API_KEY no configurada (placeholder). El chat responderá en modo fallback. " +
          "Edita backend/.env con tu clave real de OpenAI para activar la IA."
      );
    }
  }

  // Considera válida una clave sk- que no sea el placeholder de ejemplo.
  private isValidKey(key?: string): boolean {
    if (!key || !key.startsWith("sk-")) return false;
    if (key.includes("REEMPLAZA") || key.includes("TU_CLAVE")) return false;
    return key.length > 20;
  }

  // Nombre del agente, expuesto al frontend para la cabecera del chat.
  getAgentName(): string {
    return this.agentName;
  }

  private buildSystemPrompt(): string {
    // El prompt del agente se define en el .env (AI_SYSTEM_PROMPT).
    const base =
      this.config.get<string>("AI_SYSTEM_PROMPT") ||
      "Eres un agente de ventas del marketplace Integratel. Ayuda al usuario con sus compras y ventas de forma clara y amable.";
    const guardrails =
      this.config.get<string>("AI_GUARDRAILS") ||
      "Responde solo sobre el marketplace, sus productos, compras, ventas, pagos, puntos y vouchers. No inventes precios fuera del catálogo.";

    return [
      `Tu nombre es ${this.agentName}. Preséntate con ese nombre cuando sea natural.`,
      base,
      "",
      "Contexto del catálogo actual:",
      CATALOG_SUMMARY,
      "",
      "Reglas:",
      guardrails
    ].join("\n");
  }

  async reply(message: string, history: ChatMessage[] = []): Promise<string> {
    if (!this.client) {
      return this.fallbackReply(message);
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: this.buildSystemPrompt() },
      ...history.slice(-8).map((m) => ({
        role: m.role,
        content: m.content
      })) as OpenAI.Chat.ChatCompletionMessageParam[],
      { role: "user", content: message }
    ];

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.6,
        max_tokens: 500
      });
      return (
        completion.choices?.[0]?.message?.content?.trim() ||
        "Lo siento, no pude generar una respuesta en este momento."
      );
    } catch (err) {
      this.logger.error(`Error llamando a OpenAI: ${err?.message || err}`);
      return "Estoy teniendo problemas para conectarme con el asistente. Intenta de nuevo en unos momentos.";
    }
  }

  // Indica si la IA real está activa (hay API key válida).
  isAiEnabled(): boolean {
    return this.client !== null;
  }

  // Genera un mensaje personalizado para la recomendación del perfilador.
  // Usa IA si está disponible; si no, un texto determinista amable.
  async profileMessage(
    profileSummary: string,
    products: { name: string; price: number; reason: string }[]
  ): Promise<string> {
    if (!this.client) {
      return this.fallbackProfileMessage(profileSummary, products);
    }

    const productLines = products
      .map((p) => `- ${p.name} (S/ ${p.price}) — ${p.reason}`)
      .join("\n");

    const prompt = [
      `Perfil del cliente: ${profileSummary}.`,
      "Productos recomendados del catálogo (no inventes otros, usa solo estos):",
      productLines,
      "",
      "Redacta un mensaje breve (máx. 3 frases), cálido y en español peruano, que:",
      "1) resuma en una frase el perfil del cliente,",
      "2) presente estas recomendaciones de forma natural,",
      "3) invite a ver el detalle o seguir preguntando.",
      "No uses listas ni markdown; solo texto corrido. Usa montos en soles (S/)."
    ].join("\n");

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: this.buildSystemPrompt() },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 220
      });
      return (
        completion.choices?.[0]?.message?.content?.trim() ||
        this.fallbackProfileMessage(profileSummary, products)
      );
    } catch (err) {
      this.logger.error(`Error llamando a OpenAI (perfil): ${err?.message || err}`);
      return this.fallbackProfileMessage(profileSummary, products);
    }
  }

  private fallbackProfileMessage(
    profileSummary: string,
    products: { name: string; price: number; reason: string }[]
  ): string {
    const names = products.map((p) => p.name).join(", ");
    return (
      `¡Listo! Según tu perfil (${profileSummary}), creo que estas opciones te van muy bien: ${names}. ` +
      "Mira el detalle de cada una abajo y, si quieres, te ayudo a comparar o a agregar alguna al carrito. 🛍️"
    );
  }

  // Respuesta simulada cuando no hay API key (para no bloquear la demo).
  private fallbackReply(message: string): string {
    const m = message.toLowerCase();
    if (m.includes("vender") || m.includes("seller")) {
      return "Para vender en Integratel, regístrate como Seller desde 'Vender en marketplace'. Podrás publicar productos, gestionar tu stock y ver tus transacciones. (Modo demo sin IA: configura AI_API_KEY en el backend para respuestas reales.)";
    }
    if (m.includes("pago") || m.includes("pagar") || m.includes("yape")) {
      return "Aceptamos billeteras (Yape/Plin), tarjeta y depósito bancario. También puedes usar 'Pagos asociados' para repartir el monto entre varios métodos. (Modo demo sin IA.)";
    }
    if (m.includes("punto") || m.includes("voucher") || m.includes("descuento")) {
      return "Acumulas puntos con tus compras y los canjeas por vouchers de descuento que aplicas en el carrito. Revisa 'Canje de puntos' y 'Vouchers' en Mi Cuenta. (Modo demo sin IA.)";
    }
    return `¡Hola! Soy ${this.agentName}, tu agente de ventas de Integratel. Puedo ayudarte a encontrar productos, comprar o vender. Cuéntame qué buscas. (Modo demo: configura AI_API_KEY en el backend para activar la IA real.)`;
  }
}
