import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    
    // Generate token
    const token = jwt.sign({ userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    // Create cookie
    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // Cookie cannot be accessed by client side scripts (prevent XSS attacks, cross-site scripting attacks)
        sameSite: 'strict', // Cookie is only sent in same-site requests (CSRF attacks, cross-site request forgery attacks)
        secure: process.env.NODE_ENV !== 'development', // Cookie is only sent in HTTPS in production
    })


    return token;
};