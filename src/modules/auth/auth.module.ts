import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema, User } from "src/schemas/user.schema";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ],
    controllers: [AuthController],
    providers: [AuthService]
})

export class AuthModule {}