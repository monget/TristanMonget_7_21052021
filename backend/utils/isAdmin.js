const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
	const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
	const isAdmin = decodedToken.isAdmin;

	return isAdmin
}