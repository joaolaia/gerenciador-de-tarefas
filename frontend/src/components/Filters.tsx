import React from 'react';
import { Input, Select, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

interface FiltersProps {
  search: string;
  filterCategory: string;
  filterStatus: string;
  setSearch: (value: string) => void;
  setFilterCategory: (value: string) => void;
  setFilterStatus: (value: string) => void;
  clearFilters: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  search,
  filterCategory,
  filterStatus,
  setSearch,
  setFilterCategory,
  setFilterStatus,
  clearFilters,
}) => (
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
        <Option value="Trabalho">Trabalho</Option>
        <Option value="Estudo">Estudo</Option>
        <Option value="Pessoal">Pessoal</Option>
      </Select>
      <Select
        placeholder="Filtrar por Status"
        value={filterStatus}
        onChange={setFilterStatus}
        style={{ width: 180 }}
      >
        <Option value="">Todos</Option>
        <Option value="pendente">Pendente</Option>
        <Option value="concluído">Concluído</Option>
      </Select>
      <Button onClick={clearFilters}>Limpar Filtros</Button>
    </Space>
  </Space>
);

export default Filters;
