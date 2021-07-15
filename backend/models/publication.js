module.exports = (sequelize, Sequelize) => {
  const Publication = sequelize.define("publications", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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