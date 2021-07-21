module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pseudo: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    attachement: {
      type: Sequelize.STRING
    },
    birthday: {
      type: Sequelize.DATE
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
    }
  });

  return User;
};