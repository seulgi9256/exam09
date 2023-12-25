const { DataTypes, Model, Sequelize } = require('sequelize');

class todo extends Model {
  static initiate(sequelize) {
    todo.init(
      {
        no: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        content: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.INTEGER,
          defaultValue: '0',
          defaultValue: false,
        },
        reg_date: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.fn('NOW'),
        },
        upd_date: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.fn('NOW'),
        },
      },
      {
        sequelize,
        modelName: 'todo',
        tableName: 'todo',
        timestamps: false,      // true ➡ createdAt, updatedAt 컬럼 자동생성
      }
    );
  }

  static associate(db) {
    // Add associations if needed
  }
}

module.exports = todo;