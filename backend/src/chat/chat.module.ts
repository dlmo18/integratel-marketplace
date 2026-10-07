import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { ProfileService } from "./profile.service";

@Module({
  controllers: [ChatController],
  providers: [ChatService, ProfileService]
})
export class ChatModule {}
