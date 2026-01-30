import jwt from "jsonwebtoken";

export const genarateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_TOKEN!, { expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME!) });
}