import { Request, Response, NextFunction } from 'express';
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  getGoogleAuthURL,
  loginWithGoogle,
} from './authService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const { user, accessToken, refreshToken } = await registerUser(name, email, password);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await loginUser(email, password);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const me = async (req: Request, res: Response) => {
  res.json({ user: req.user });
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Missing refresh token' });

    const newAccessToken = await refreshAccessToken(refreshToken);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await logoutUser(req.user!.id);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({ message: 'Logout successful' });
  } catch (err) {
    next(err);
  }
};

export const googleLogin = (_req: Request, res: Response) => {
  const url = getGoogleAuthURL();
  res.redirect(url);
};

export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;

    if (!code) {
      res.status(400).json({ message: 'Authorization code missing' });
      return;
    }

    const { user, accessToken, refreshToken } = await loginWithGoogle(code as string);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};
