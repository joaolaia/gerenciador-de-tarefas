import React from 'react';
import { Input, Select, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTasks } from '../contexts/TasksContext';

const { Option } = Select;

const Filters: React.FC = () => {
  const {
    search,
    filterCategory,
    filterStatus,
    setSearch,
    setFilterCategory,
    setFilterStatus,
    clearFilters,
    categories,
  } = useTasks();

  return (
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
          onChange={setFilterCategory}
          style={{ width: 180 }}
        >
          <Option value="">Todas</Option>
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por Status"
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 180 }}
        >
          <Option value="">Todas</Option>
          <Option value="pendente">Pendentes</Option>
          <Option value="concluído">Concluídas</Option>
        </Select>
        <Button onClick={clearFilters}>Limpar Filtros</Button>
      </Space>
    </Space>
  );
};

export default Filters;
