import type {Admin} from ".prisma/client";
import {prisma} from "~/server/service/prisma.service";

class AdminService {
	async getAdminByLogin(login: string): Promise<Admin | null> {
		return prisma.admin.findUnique({
			where: {
				login
			}
		})
	}
}

export default new AdminService()