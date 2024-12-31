import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Task extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public status!: string;
  public dueDate!: Date | null;
  public category!: string;
}

Task.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'concluído'),
      allowNull: false,
      defaultValue: 'pendente',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Task',
  }
);

export default Task;
