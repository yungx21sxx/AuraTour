import type {UserUpdateDTO} from "~/types/dto.types";
import userService from "~/server/service/user.service";

export default defineEventHandler(async event => {
	const dto = await readBody<UserUpdateDTO>(event);
	return userService.updateUser(dto);
})