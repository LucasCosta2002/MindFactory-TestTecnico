import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => await bcrypt.hash(password, await bcrypt.genSalt(10));

export const checkPassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
}