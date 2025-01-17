import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import { useTasks } from '../contexts/TasksContext';
import api from '../services/api';
import dayjs from 'dayjs';

const { Option } = Select;

interface EditTaskModalProps {
  visible: boolean;
  onClose: () => void;
  taskToEdit: Task | null;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ visible, onClose, taskToEdit }) => {
  const [form] = Form.useForm();
  const { categories, refreshTasks } = useTasks();
  const [isNewCategory, setIsNewCategory] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      form.setFieldsValue({
        title: taskToEdit.title,
        description: taskToEdit.description,
        dueDate: dayjs(taskToEdit.dueDate),
        category: taskToEdit.category,
      });
    }
  }, [taskToEdit, form]);

  const handleEdit = async (values: any) => {
    if (!taskToEdit) return;

    try {
      const updatedTask = {
        ...taskToEdit,
        title: values.title,
        description: values.description,
        category: isNewCategory ? values.newCategory : values.category,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
      };

      await api.put(`/tasks/${taskToEdit.id}`, updatedTask);
      message.success('Tarefa editada com sucesso!');
      refreshTasks();
      onClose();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao editar tarefa!');
    }
  };

  return (
    <Modal
      visible={visible}
      title="Editar Tarefa"
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
        onFinish={handleEdit}
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
            style={{ marginRight: 8 }}
            disabled={
              !form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Concluir
          </Button>
          <Button onClick={onClose}>
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTaskModal;
