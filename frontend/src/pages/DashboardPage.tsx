import React, { useEffect, useState } from 'react';
import {
  Layout,
  Input,
  Button,
  Table,
  Dropdown,
  Space,
  Menu,
  message,
} from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import axios from '../services/api';

const { Header, Content } = Layout;

interface Task {
  id: number;
  title: string;
  category: string;
  status: string;
  dueDate: string;
}

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('pendente');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, categoryFilter, tasks]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
      setFilteredTasks(response.data);

      const tasksData: Task[] = response.data;
      const uniqueCategories = Array.from(
        new Set(tasksData.map((task) => task.category))
      );
      setCategories(uniqueCategories);

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

    if (statusFilter) {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter((task) => task.category === categoryFilter);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB;
    });

    setFilteredTasks(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('pendente');
    setCategoryFilter(null);
    applyFilters();
  };

  const categoryMenu = (
    <Menu
      onClick={(e) => setCategoryFilter(e.key)}
      items={categories.map((category) => ({
        label: category,
        key: category,
      }))}
    />
  );

  const statusMenu = (
    <Menu
      onClick={(e) => setStatusFilter(e.key)}
      items={[
        { label: 'Pendentes', key: 'pendente' },
        { label: 'Concluídas', key: 'concluído' },
      ]}
    />
  );

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
      <Content style={{ padding: '20px' }}>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Buscar tarefa"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Dropdown overlay={categoryMenu}>
            <Button icon={<FilterOutlined />}>
              {categoryFilter || 'Categoria'}
            </Button>
          </Dropdown>
          <Dropdown overlay={statusMenu}>
            <Button icon={<FilterOutlined />}>
              {statusFilter === 'pendente'
                ? 'Pendentes'
                : statusFilter === 'concluído'
                ? 'Concluídas'
                : 'Status'}
            </Button>
          </Dropdown>
          {(categoryFilter || statusFilter !== 'pendente') && (
            <Button onClick={handleClearFilters}>Limpar Filtros</Button>
          )}
        </Space>
        <Table
          dataSource={filteredTasks}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Content>
    </Layout>
  );
};

export default DashboardPage;
