module.exports = (sequelize, Sequelize) => {
    const Publication = sequelize.define("publications", {
      title: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.TEXT
      },
      attachement: {
        type: Sequelize.STRING
      },
      like: {
        type: Sequelize.INTEGER
      }
    });
  
    return Publication;
  };