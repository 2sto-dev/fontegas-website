import bcrypt from 'bcrypt'

export const hashPassword = async (password) => bcrypt.hash(password, 12)

export const verifyPassword = async (password, passwordHash) => bcrypt.compare(password, passwordHash)
