module.exports = (sequelize, Sequelize) => {
  const Like = sequelize.define("likes", {
    usersLiked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    usersDisliked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  return Like;
};