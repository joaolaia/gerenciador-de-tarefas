import React, { useEffect, useState } from 'react';
import {
  Layout,
  Input,
  Button,
  Table,
  Space,
  message,
  Card,
  Select,
} from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import axios from '../services/api';

const { Header, Content } = Layout;
const { Option } = Select;

interface Task {
  id: number;
  title: string;
  category: string;
  status: string;
  dueDate: string;
  description: string;
}

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [search, setSearch] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, filterCategory, filterStatus, tasks]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
      setFilteredTasks(response.data);

      const sortedTasks = response.data.sort((a: Task, b: Task) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return dateA - dateB;
      });
      setSelectedTask(sortedTasks[0] || null);
    } catch (error: any) {
      message.error(
        error.response?.data?.message || 'Erro ao carregar tarefas!'
      );
    }
  };

  const applyFilters = () => {
    let filtered = tasks;

    if (search) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter((task) => task.category === filterCategory);
    }

    if (filterStatus) {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    setFilteredTasks(filtered);
  };

  const clearFilters = () => {
    setSearch('');
    setFilterCategory('');
    setFilterStatus('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleTaskAction = (action: 'complete' | 'delete') => {
    if (!selectedTask) return;

    const token = localStorage.getItem('token');

    if (action === 'complete') {
      axios
        .put(
          `/tasks/${selectedTask.id}`,
          { status: 'concluído' },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          message.success('Tarefa concluída!');
          fetchTasks();
        })
        .catch(() => {
          message.error('Erro ao concluir a tarefa.');
        });
    } else if (action === 'delete') {
      axios
        .delete(`/tasks/${selectedTask.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          message.success('Tarefa excluída!');
          fetchTasks();
        })
        .catch(() => {
          message.error('Erro ao excluir a tarefa.');
        });
    }
  };

  const columns = [
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
    <Layout>
      <Header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button type="primary" icon={<UserOutlined />} onClick={() => {}}>
            Perfil
          </Button>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Sair
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: '20px', display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
            <Input
              placeholder="Buscar tarefa"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Space>
              <Select
                placeholder="Filtrar por Categoria"
                value={filterCategory}
                onChange={(value) => setFilterCategory(value)}
                style={{ width: 180 }}
              >
                <Option value="">Todas</Option>
                <Option value="Trabalho">Trabalho</Option>
                <Option value="Estudo">Estudo</Option>
                <Option value="Pessoal">Pessoal</Option>
              </Select>
              <Select
                placeholder="Filtrar por Status"
                value={filterStatus}
                onChange={(value) => setFilterStatus(value)}
                style={{ width: 180 }}
              >
                <Option value="">Todos</Option>
                <Option value="pendente">Pendente</Option>
                <Option value="concluído">Concluído</Option>
              </Select>
              <Button onClick={clearFilters}>Limpar Filtros</Button>
            </Space>
          </Space>
          <Table
            dataSource={filteredTasks}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: 'Nenhuma tarefa cadastrada' }}
            onRow={(record) => ({
              onClick: () => setSelectedTask(record),
            })}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Card title="Detalhes da Tarefa">
            {selectedTask ? (
              <div>
                <p><strong>Título:</strong> {selectedTask.title}</p>
                <p><strong>Categoria:</strong> {selectedTask.category}</p>
                <p><strong>Data de Entrega:</strong> {new Date(selectedTask.dueDate).toLocaleDateString('pt-BR')}</p>
                <p><strong>Descrição:</strong> {selectedTask.description}</p>
                <Space style={{ marginTop: 16 }}>
                  <Button type="primary" onClick={() => {}}>
                    Adicionar Tarefa
                  </Button>
                  <Button onClick={() => {}}>Editar Tarefa</Button>
                  <Button type="default" onClick={() => handleTaskAction('complete')}>
                    Concluir
                  </Button>
                  <Button type="primary" danger onClick={() => handleTaskAction('delete')}>
                    Excluir
                  </Button>
                </Space>
              </div>
            ) : (
              <p>Nenhuma tarefa selecionada.</p>
            )}
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default DashboardPage;
