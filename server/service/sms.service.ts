import GreenSMS from "greensms";
import {prisma} from "~/server/service/prisma.service";
import type {SmsCode} from "@prisma/client";


import otpGenerator from 'otp-generator';

class SmsService {
	smsProvider: any;
	constructor() {
		// @ts-ignore
		this.smsProvider =  new GreenSMS({user: 'yungx21sxx', pass: 'newman2104'});
	}
	private generateOTP(): number {
		const digits: string = '0123456789';
		let OTP: string = '';
		for (let i = 0; i < 6; i++ ) {
			OTP += digits[Math.floor(Math.random() * 9)];
		}
		return parseInt(OTP);
	}

	private async sendSms(phone: string, massage: string) {
		try {
			const response = await this.smsProvider.sms.send({to: phone, txt: massage});
			return response;
		} catch (error: any) {
			console.log(error);
			throw new Error(error)
		}
	}

	private async saveOtp(phone: string, otp: number): Promise<SmsCode> {
		try {
			const smsCode: SmsCode = await prisma.smsCode.create({
				data: {
					userPhone: phone,
					otp,
				}
			})
			return smsCode
		} catch (e: any) {
			throw new Error(e)
		}
	}

	private async getSmsCode(phone: string): Promise<SmsCode | null> {
		const smsCode: SmsCode | null = await prisma.smsCode.findUnique({
			where: {
				userPhone: phone
			}
		})
		console.log('sms', smsCode)
		return smsCode
	}

	async resetOtp(phone: string): Promise<SmsCode | null> {
		const otpFromDB = await prisma.smsCode.findUnique({
			where: {
				userPhone: phone,
			}
		});

		if (!otpFromDB) return null;

		await this.deleteOtp(phone);

		const otp: number = this.generateOTP();
		const smsCode: SmsCode = await this.saveOtp(phone, otp);
		return smsCode;

	}

	async createOtp(phone: string): Promise<SmsCode | null> {
		const otpFromDB = await prisma.smsCode.findUnique({
			where: {
				userPhone: phone,
			}
		});
		if (otpFromDB) {
			return otpFromDB;
		}
		try {
			const otpString: string = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
			const otp: number = parseInt(otpString);
			await this.sendSms(phone, `Aura Tour. Код: ${otp}.`);
			const smsCode: SmsCode = await this.saveOtp(phone, otp);
			return smsCode;
		} catch (e: any) {
			console.log(e)
			throw new Error(e);
		}

	}

	async validateOtp(phone: string, otp: number): Promise<SmsCode | null> {
		const smsCode: SmsCode | null = await this.getSmsCode(phone);
		if (!smsCode || smsCode.otp !== otp) {
			return null;
		}
		const currentDate = new Date();
		const difference = currentDate.getTime() - smsCode.createdAt.getTime();
		if (difference <= 5 * 60 * 1000) {
			return prisma.smsCode.delete({
				where: {
					userPhone: phone
				}
			});
		} else {
			return null;
		}
	}

	async deleteOtp(phone: string): Promise<SmsCode | null> {
		 return prisma.smsCode.delete({
			where: { userPhone: phone }
		})
	}
}

export default new SmsService()