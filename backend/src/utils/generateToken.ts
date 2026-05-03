import jwt from 'jsonwebtoken';

export const generateToken = (id: string): string => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: '1d',
  });

  return token;
};