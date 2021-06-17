module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comments", {
      pseudo: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.TEXT
      },
      like: {
        type: Sequelize.INTEGER
      },
    });
  
    return Comment;
  };