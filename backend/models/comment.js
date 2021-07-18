module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comments", {
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

  return Comment;
};