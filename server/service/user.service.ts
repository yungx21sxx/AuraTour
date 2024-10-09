
import {prisma} from "~/server/service/prisma.service";
import type {User} from "@prisma/client";
import type {UserUpdateDTO} from "~/types/dto.types";

class UserService {
	async getUsers(): Promise<User[]> {
		return prisma.user.findMany();
	}

	async createUser(user: {phone: string, phoneRaw: string}): Promise<User> {
		return prisma.user.create({
			data: {
				...user
			}
		})
	}

	async updateUser(dto: UserUpdateDTO) {
		const {id, ...data} = dto
		return prisma.user.update({
			where: {id},
			data
		})
	}


	async getUserByPhoneRow(phoneRaw: string): Promise<User | null | undefined> {
		try {
			const user = await prisma.user.findUnique({
				where: {
					phoneRaw,
				}
			});
			if (!user) {
				return null;
			}
			return user;
		} catch (e) {
			console.error(e)
		}
	}

	async getUserById(id: number): Promise<User | null | undefined>{
		try {
			const user: User | null = await prisma.user.findUnique({
				where: {
					id,
				}
			});
			if (!user) {
				return null;
			}
			return user;
		} catch (e) {
			console.error(e)
		}
	}
}

export default new UserService()
