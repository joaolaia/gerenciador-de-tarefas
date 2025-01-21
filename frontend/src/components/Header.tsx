import React, { useState } from 'react';
import { Button, Layout, Space } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import ProfileModal from './ProfileModal';

const { Header } = Layout;

interface HeaderComponentProps {
  handleLogout: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ handleLogout }) => {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  return (
    <>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button
            type="primary"
            icon={<UserOutlined />}
            onClick={() => setIsProfileModalVisible(true)}
          >
            Perfil
          </Button>
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Sair
          </Button>
        </Space>
      </Header>
      <ProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
      />
    </>
  );
};

export default HeaderComponent;
