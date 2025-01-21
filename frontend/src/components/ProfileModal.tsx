import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Space, Typography } from 'antd';
import { getProfile, updateProfile, changePassword } from '../services/profileService';

const { Text } = Typography;

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      getProfile()
        .then((data) => {
          setUserData(data);
          form.setFieldsValue(data);
        })
        .catch(() => message.error('Erro ao carregar perfil.'));
    }
  }, [visible]);

  const handleEditProfile = async () => {
    try {
      const values = await form.validateFields();
      await updateProfile(values);
      setUserData(values);
      message.success('Perfil editado com sucesso!');
      setIsEditingProfile(false);
    } catch (error) {
      message.error('Erro ao editar perfil.');
    }
  };

  const handleChangePassword = async () => {
    try {
      const { oldPassword, newPassword, confirmPassword } = form.getFieldsValue();
      if (newPassword !== confirmPassword) {
        message.error('As senhas devem ser idênticas.');
        return;
      }
      await changePassword({ oldPassword, newPassword });
      message.success('Senha alterada com sucesso!');
      setIsChangingPassword(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Erro ao alterar senha.');
    }
  };

  const handleStartEditing = () => {
    form.setFieldsValue(userData);
    setIsEditingProfile(true);
  };

  return (
    <Modal
      visible={visible}
      title="Perfil"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} initialValues={userData} layout="vertical">
        {!isChangingPassword ? (
          <>
            {isEditingProfile ? (
              <>
                <Form.Item
                  label="Nome"
                  name="name"
                  rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: 'email', message: 'Por favor, insira um email válido!' }]}
                >
                  <Input />
                </Form.Item>
              </>
            ) : (
              <>
                <p>
                  <strong>Nome:</strong> <Text>{userData.name}</Text>
                </p>
                <p>
                  <strong>Email:</strong> <Text>{userData.email}</Text>
                </p>
              </>
            )}
          </>
        ) : (
          <>
            <Form.Item
              label="Senha antiga"
              name="oldPassword"
              rules={[{ required: true, message: 'Por favor, insira sua senha antiga!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Nova senha"
              name="newPassword"
              rules={[{ required: true, message: 'Por favor, insira sua nova senha!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Confirmar nova senha"
              name="confirmPassword"
              rules={[{ required: true, message: 'Por favor, confirme sua nova senha!' }]}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}
        <Space>
          {!isEditingProfile && !isChangingPassword && (
            <>
              <Button onClick={handleStartEditing}>Editar Perfil</Button>
              <Button onClick={() => setIsChangingPassword(true)}>Mudar Senha</Button>
            </>
          )}
          {(isEditingProfile || isChangingPassword) && (
            <>
              <Button
                onClick={() => {
                  setIsEditingProfile(false);
                  setIsChangingPassword(false);
                  form.resetFields();
                  message.info(
                    isEditingProfile
                      ? 'Edição do perfil cancelada!'
                      : 'Alteração da senha cancelada!'
                  );
                }}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                onClick={isEditingProfile ? handleEditProfile : handleChangePassword}
              >
                Concluir
              </Button>
            </>
          )}
          <Button onClick={onClose}>Fechar</Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default ProfileModal;
