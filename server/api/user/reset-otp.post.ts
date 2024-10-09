import {H3Error, H3Event} from "h3";

import type {createOtpDTO} from "~/types/dto.types";

import smsService from "~/server/service/sms.service";

export default defineEventHandler(async (event: H3Event) => {
	const { phoneRow } = await readBody<createOtpDTO>(event);
	const otp = smsService.resetOtp(phoneRow);
	if (!otp) {
		return createError({
			statusCode: 404,
			statusMessage: ''
		});
	}

	return otp;
})