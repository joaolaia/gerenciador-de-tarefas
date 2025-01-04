import React from 'react';
import { Button, Layout, Space } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

interface HeaderComponentProps {
  handleLogout: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ handleLogout }) => (
  <Header style={{ display: 'flex', justifyContent: 'space-between' }}>
    <Space>
      <Button type="primary" icon={<UserOutlined />} onClick={() => {}}>
        Perfil
      </Button>
      <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
        Sair
      </Button>
    </Space>
  </Header>
);

export default HeaderComponent;
