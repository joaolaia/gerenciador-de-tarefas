import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import { useTasks } from '../contexts/TasksContext';
import { Task } from '../services/taskService';
import api from '../services/api';
import dayjs from 'dayjs';

const { Option } = Select;

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const { categories, refreshTasks } = useTasks();
  const [isNewCategory, setIsNewCategory] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      const taskData: Task = {
        id: 0,
        title: values.title,
        description: values.description,
        category: isNewCategory ? values.newCategory : values.category,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        status: 'pendente',
      };

      await api.post('/tasks', taskData);
      message.success('Tarefa adicionada com sucesso!');
      refreshTasks();
      form.resetFields();
      setIsNewCategory(false);
      onClose();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao adicionar tarefa!');
    }
  };

  return (
    <Modal
      visible={visible}
      title="Adicionar Tarefa"
      onCancel={() => {
        form.resetFields();
        setIsNewCategory(false);
        onClose();
      }}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ dueDate: dayjs() }}
      >
        <Form.Item
          label="Título"
          name="title"
          rules={[{ required: true, message: 'Por favor, insira o título da tarefa!' }]}
        >
          <Input placeholder="Digite o título" />
        </Form.Item>

        <Form.Item
          label="Descrição"
          name="description"
          rules={[{ required: true, message: 'Por favor, insira a descrição da tarefa!' }]}
        >
          <Input.TextArea placeholder="Digite a descrição" rows={3} />
        </Form.Item>

        <Form.Item
          label="Prazo"
          name="dueDate"
          rules={[{ required: true, message: 'Por favor, selecione o prazo!' }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: '100%' }}
            onChange={(date) => form.setFieldsValue({ dueDate: date })}
            value={form.getFieldValue('dueDate')}
          />
        </Form.Item>

        <Form.Item
          label="Categoria"
          name={isNewCategory ? 'newCategory' : 'category'}
          rules={[
            { required: true, message: 'Por favor, selecione ou insira uma categoria!' },
          ]}
        >
          {isNewCategory ? (
            <Input
              placeholder="Digite a nova categoria"
              onBlur={() => {
                if (!form.getFieldValue('newCategory')) setIsNewCategory(false);
              }}
            />
          ) : (
            <Select
              placeholder="Selecione uma categoria"
              onChange={(value) => {
                if (value === '+Nova categoria') {
                  setIsNewCategory(true);
                  form.setFieldsValue({ category: null });
                }
              }}
            >
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
              <Option value="+Nova categoria">+Nova categoria</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: '100%' }}
          >
            Concluir
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTaskModal;
