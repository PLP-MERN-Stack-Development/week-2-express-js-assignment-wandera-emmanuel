const auth = (req, res, next) => {
 const apiKey = req.headers['x-api-key'];
 if (!apiKey || apiKey !== process.env.API_KEY || 'your-secret-key') {
 return res.status(401).json({ error: 'Unauthorized' });
 }
 next();
};

module.exports = auth;