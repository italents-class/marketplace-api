import { Auth } from "modules/Auth/entities/Auth";
import { IAuthRepositories } from "modules/Auth/repositpries/IAuthRepositories";
import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { ConflitError } from "helpers/errors/apiErrors";

@injectable()
export class SigninService {
  constructor(
    @inject("AuthRepositories")
    private authRepositories: IAuthRepositories
  ) {}

  async execute(data: Auth) {
    const user = await this.authRepositories.findUserByEmail(data.email);
    if (!user) throw new ConflitError("Email or password invalid");

    const passwordOk = await bcrypt.compare(data.password, user.password);
    if (!passwordOk) throw new ConflitError("Email or password invalid");

    return this.authRepositories.generateToken(user._id);
  }
}
