
'use strict';
const {
  Op,
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * this method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User,{
        foreignKey:'userId'
      })
      // define association here
    }

    static addTodo({ title, duedate }) {
      return Todo.create({ title: title, duedate: duedate, markAsComplete: false })
    }

    static async overdue() {
      return await Todo.findAll({
        where: {
          duedate: {
            [Op.lt]: new Date().toLocaleDateString("en-CA"),
          },
          markAsComplete: false
        },
        order: [["id", "ASC"]],
      });
    }
    static async dueLater() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS

      return await Todo.findAll({
        where: {
          duedate: {
            [Op.gt]: new Date(),
          },
          markAsComplete: false
        }
      });
    }
    static dueToday() {
      return this.findAll({
        where: {
          duedate: {
            [Op.eq]: new Date().toLocaleDateString("en-CA"),
          },
          markAsComplete: false

        },
        order: [["id", "ASC"]],
      });
    }
    static async completedItems() {
      return await Todo.findAll({
        where: {
          markAsComplete: true,
        },
        order: [["id", "ASC"]],
      });
    }
    setCompletionStatus() {
      if (this.markAsComplete == true) {
        return this.update({ markAsComplete: false })
      }
      else if (this.markAsComplete == false) {
        return this.update({ markAsComplete: true })
      }
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    duedate: DataTypes.DATEONLY,
    markAsComplete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};
