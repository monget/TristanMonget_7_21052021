module.exports = (sequelize, Sequelize) => {
  const Publication = sequelize.define("publications", {
    message: {
      type: Sequelize.TEXT
    },
    attachement: {
      type: Sequelize.STRING
    },
    like: {
      type: Sequelize.INTEGER
    },
    dislike: {
      type: Sequelize.INTEGER
    }
  });

  return Publication;
};