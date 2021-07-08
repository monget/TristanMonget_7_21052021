module.exports = (sequelize, Sequelize) => {
  const Like = sequelize.define("likes", {
    usersLiked: {
      type: Sequelize.BOOLEAN
    },
    usersDisliked: {
      type: Sequelize.BOOLEAN
    }
  });

  return Like;
};