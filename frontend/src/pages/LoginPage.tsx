import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import axios from '../services/api';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (values: any) => {
    const endpoint = isLogin ? '/login' : '/register';
    try {
      const response = await axios.post(endpoint, values);
      const successMessage = isLogin
        ? 'Login bem-sucedido!'
        : 'Registro realizado com sucesso!';
      message.success(successMessage);

      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro inesperado!';
      message.error(errorMessage);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card title={isLogin ? 'Login' : 'Registro'} style={{ width: 400 }}>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ remember: true }}
        >
          {!isLogin && (
            <Form.Item
              label="Nome"
              name="name"
              rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
            >
              <Input placeholder="Digite seu nome" />
            </Form.Item>
          )}
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: 'Por favor, insira seu e-mail!' },
              { type: 'email', message: 'Por favor, insira um e-mail válido!' },
            ]}
          >
            <Input placeholder="Digite seu e-mail" />
          </Form.Item>
          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
          >
            <Input.Password placeholder="Digite sua senha" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block icon={isLogin ? <LoginOutlined /> : <UserAddOutlined />}>
              {isLogin ? 'Entrar' : 'Registrar'}
            </Button>
          </Form.Item>
        </Form>
        <Button type="link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Não possui uma conta? Registre-se' : 'Já possui uma conta? Faça login'}
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;