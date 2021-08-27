import { inject, injectable } from "tsyringe";
import { hash } from "bcryptjs";

import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

import { AppError } from "@errors/AppError";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository") private usersRepository: IUsersRepository
  ) {}

  async execute({
    name,
    email,
    password,
    driverLicense,
  }: ICreateUserDTO): Promise<void> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) throw new AppError("Username already in use");

    const hashedPassword = await hash(password, 8);

    await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      driverLicense,
    });
  }
}

export { CreateUserUseCase };
