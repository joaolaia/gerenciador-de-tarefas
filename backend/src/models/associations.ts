import Task from './task';
import User from './user';

export const defineAssociations = (): void => {
  User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
  Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });
};
