import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

interface Task {
  id: number;
  title: string;
  category: string;
  status: string;
  dueDate: string;
  description: string;
}

interface TasksTableProps {
  filteredTasks: Task[];
  onTaskSelect: (task: Task) => void;
}

const TasksTable: React.FC<TasksTableProps> = ({
  filteredTasks,
  onTaskSelect,
}) => {
  const columns: ColumnsType<Task> = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Prazo',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (_: string, record: Task) =>
        record.status === 'concluído'
          ? 'Concluída'
          : new Date(record.dueDate).toLocaleDateString('pt-BR'),
    },
  ];

  return (
    <Table
      dataSource={filteredTasks}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 5 }}
      locale={{ emptyText: 'Nenhuma tarefa cadastrada' }}
      onRow={(record) => ({
        onClick: () => onTaskSelect(record),
      })}
    />
  );
};

export default TasksTable;
