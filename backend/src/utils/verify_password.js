import bcrypt from 'bcrypt';

export const isverify = (password, hashpassword) => {
    return bcrypt.compare(password, hashpassword);
}