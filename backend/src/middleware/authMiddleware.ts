import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'


export function authenticateToken(req: any, res: Response, next: NextFunction) {

    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token Bulunamadi' });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

        req.userId = verified.userId;
        next();


    } catch (error) {
        return res.status(401).json({ message: "Token geçersiz veya süresi dolmuş" })
    }

}