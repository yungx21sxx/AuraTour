export const parsePhone = async (phone: string): Promise<string> => {
    try {
        const {default: parsePhoneNumber} = await import('libphonenumber-js');
        const parseResult = parsePhoneNumber(phone, "RU");
        return parseResult ? parseResult.formatNational() : phone;
    } catch (e) {
        return phone;
    }
}