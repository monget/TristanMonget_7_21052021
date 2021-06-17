const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const token = req.headers.authorization;
	const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
	const userId = decodedToken.userId;
	
	return userId
}