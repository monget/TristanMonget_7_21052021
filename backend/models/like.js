module.exports = (sequelize, Sequelize) => {
  const Likes = sequelize.define("likes", {
    usersLiked: {
      type: Sequelize.BOOLEAN
    },
    usersDisliked: {
      type: Sequelize.BOOLEAN
    }
  });

  return Likes;
};