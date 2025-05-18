import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { SignInDto, SignUpDto } from "./dto/auth.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schemas/user.schema";
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly configServce: ConfigService,
    ){}

    async signUp(dto: SignUpDto) {
        const {username, password, age} = dto;
        
        let user = await this.userModel.findOne({ username });

        if(user) {
            throw new ConflictException('Username is not available for usage');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await this.userModel.create({
            username,
            password: hashedPassword,
            age,
        })

        const { password: _password, ...result } = user.toJSON();
        
        return result;
    }

    async signIn(dto: SignInDto) {
        const user = await this.userModel.findOne({ username: dto.username });

        if(!user) {
            throw new ForbiddenException('Credentials provided are incorrect');
        }

        const isPasswordMatching = await bcrypt.compare(dto.password, user.password);

        if(!isPasswordMatching) {
            throw new UnauthorizedException('Credentials provided are incorrect');
        }

        const { username } = user.toJSON();

        const payload = { username };

        const token = jwt.sign(payload, this.configServce.getOrThrow<string>('JWT_SECRET'));

        return {
            token,
        };
    }
}