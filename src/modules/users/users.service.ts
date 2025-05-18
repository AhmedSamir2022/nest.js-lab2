import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/schemas/user.schema";
import { Model } from "mongoose";
import { IJwtPayload } from "src/interfaces/jwt-payload.interface";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    getAllUsers() {
        return this.userModel.find({});
    }

    async getProfile(user: IJwtPayload) {
        return this.userModel
        .findOne({username: user.username})
        .select('username age');
    }
}