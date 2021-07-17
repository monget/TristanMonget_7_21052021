module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
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
      }
    });
  
    return User;
  };