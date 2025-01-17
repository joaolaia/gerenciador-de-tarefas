import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import { useTasks } from '../contexts/TasksContext';
import api from '../services/api';
import dayjs from 'dayjs';

const { Option } = Select;

interface EditTaskModalProps {
  visible: boolean;
  onClose: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ visible, onClose }) => {
  const { selectedTask, categories, refreshTasks } = useTasks();
  const [form] = Form.useForm();
  const [isNewCategory, setIsNewCategory] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      form.setFieldsValue({
        ...selectedTask,
        dueDate: dayjs(selectedTask.dueDate),
      });
    }
  }, [selectedTask, form]);

  const handleSubmit = async (values: any) => {
    try {
      const updatedTask = {
        ...selectedTask,
        ...values,
        category: isNewCategory ? values.newCategory : values.category,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
      };

      await api.put(`/tasks/${selectedTask?.id}`, updatedTask);
      message.success('Tarefa editada com sucesso!');
      refreshTasks();
      onClose();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao editar a tarefa!');
    }
  };

  return (
    <Modal
      visible={visible}
      title="Editar Tarefa"
      onCancel={() => {
        form.resetFields();
        setIsNewCategory(false);
        message.info('Edição da tarefa cancelada');
        onClose();
      }}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
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
          >
            Concluir
          </Button>
          <Button onClick={() => onClose()}>Cancelar</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTaskModal;
