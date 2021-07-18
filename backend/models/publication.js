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
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    dislike: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  });

  return Publication;
};