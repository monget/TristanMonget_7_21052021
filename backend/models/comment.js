module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comments", {
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

  return Comment;
};