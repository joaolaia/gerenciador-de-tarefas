import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'E-mail já está em uso.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Usuário registrado com sucesso.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar o usuário.' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    return;
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Credenciais inválidas.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Credenciais inválidas.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
    });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Token não fornecido.' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ message: 'Erro ao obter perfil.' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Token não fornecido.' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    const { name, email } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: 'Nome e email são obrigatórios.' });
      return;
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    user.name = name;
    user.email = email;
    await user.save();

    res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil.' });
  }
};
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Token não fornecido.' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Credencial inválida.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Senha alterada com sucesso!' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro ao alterar senha.' });
  }
};
