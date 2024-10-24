import jwt from 'jsonwebtoken';

const jwtSecret = '6ErGNBRqLylhdbEPNGudiivduguvoqhgiqoihihhiwqgwhiqoswigfwfefef'

export const auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        console.log('No token, authorization denied');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    console.log('Received token:', token); // Log the token

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        console.log('Token is valid', decoded);
       
        next();
    } catch (err) {
        console.log('Token is not valid', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
