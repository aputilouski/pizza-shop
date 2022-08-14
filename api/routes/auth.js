const express = require('express');
const router = express.Router();
const yup = require('yup');
const { validate, verifyUser } = require('@middleware');
const { User, RefreshToken } = require('@models');
const { strategies } = require('@config');
const { Op } = require('sequelize');

const USERNAME = yup.string().min(4, 'Must be 4 characters or more').max(20, 'Must be 20 characters or less').required('Required');
const PASSWORD = yup.string().min(8, 'Must be 8 characters or more').max(20, 'Must be 20 characters or less').required('Required');
const NAME = yup.string().min(4, 'Must be 4 characters or more').max(40, 'Must be 40 characters or less').required('Required');

const SignUpSchema = yup.object({ body: yup.object({ username: USERNAME, password: PASSWORD, name: NAME }) });

router.post('/sign-up', validate(SignUpSchema), async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const encryptedPassword = await User.encryptPassword(password);
    await User.create({ name, username, password: encryptedPassword });

    res.status(201).json({ message: 'User has been registered' });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Some error occurred while creating the user');
  }
});

const SignInSchema = yup.object({ body: yup.object({ username: USERNAME, password: PASSWORD }) });

router.post('/sign-in', validate(SignInSchema), async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
      include: { model: RefreshToken, as: 'tokens' },
      order: [[{ model: RefreshToken, as: 'tokens' }, 'created_at', 'desc']],
    });
    if (!user) return res.status(400).json({ message: 'Incorrect credentials' });

    const passwordConfirmed = await user.confirmPassword(password);
    if (!passwordConfirmed) return res.status(400).json({ message: 'Incorrect username or password' });

    const tokens = user.tokens;
    if (req.signedCookies?.refreshToken) {
      const { uuid, token } = req.signedCookies?.refreshToken;
      const index = tokens.findIndex(token => token.uuid === uuid);
      const currentRefreshToken = tokens[index];
      if (currentRefreshToken?.token === token) {
        await currentRefreshToken.destroy();
        tokens.splice(index, 1);
      } else res.clearCookie('refreshToken');
    }

    if (tokens.length > 4) {
      await RefreshToken.destroy({
        where: { uuid: tokens.filter((t, i) => i >= 4).map(t => t.uuid) },
      });
    }

    const { uuid, token } = await RefreshToken.create({ token: strategies.generateRefreshToken(user), user_id: user.uuid });
    res.cookie('refreshToken', { uuid, token }, strategies.COOKIE_OPTIONS);
    res.json({ token: strategies.generateAccessToken(user), user: user.getPublicAttributes() });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'An error occurred while logging in');
  }
});

const refreshToken =
  (withUser = false) =>
  async (req, res) => {
    try {
      if (!req.signedCookies?.refreshToken) return res.status(401).json({ message: 'No refresh token' });
      const refreshToken = await RefreshToken.findByPk(req.signedCookies.refreshToken.uuid, { include: { model: User, as: 'user' } });
      if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });
      await refreshToken.destroy();
      const payload = strategies.verifyRefreshToken(req.signedCookies.refreshToken.token);
      if (req.signedCookies.refreshToken.token !== refreshToken.token || payload.user_id !== refreshToken.user.uuid) return res.status(401).json({ message: 'Bad token' });
      const user = refreshToken.user;
      const { uuid, token } = await RefreshToken.create({ token: strategies.generateRefreshToken(user), user_id: user.uuid });
      res.cookie('refreshToken', { uuid, token }, strategies.COOKIE_OPTIONS);
      const result = { token: strategies.generateAccessToken(user) };
      if (withUser) result.user = user.getPublicAttributes();
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message || 'An error occurred while generating a new token');
    }
  };

router.post('/refresh-token', refreshToken());

router.post('/auto-sign-in', refreshToken(true));

router.post('/sign-out', async (req, res) => {
  if (req.signedCookies?.refreshToken) {
    const refreshToken = await RefreshToken.findByPk(req.signedCookies.refreshToken.uuid);
    if (refreshToken) await refreshToken.destroy();
  }
  res.clearCookie('refreshToken');
  res.end();
});

const UserUpdateSchema = yup.object({ body: yup.object({ username: USERNAME, name: NAME }) });

router.post('/user', verifyUser, validate(UserUpdateSchema), async (req, res) => {
  try {
    const { name, username } = req.body;

    if (req.user.username !== username) {
      const user = await User.findOne({ where: { username } });
      if (user) return res.status(400).json({ message: 'User with the same username already exists' });
    }

    req.user.name = name;
    req.user.username = username;
    await req.user.save();

    res.json({ user: req.user.getPublicAttributes(), message: 'User information updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Some error occurred while updating the user');
  }
});

router.get('/user', verifyUser, async (req, res) => {
  res.json({ user: req.user.getPublicAttributes() });
});

const PasswordUpdateSchema = yup.object({ body: yup.object({ currentPassword: PASSWORD, password: PASSWORD }) });

router.post('/update-password', verifyUser, validate(PasswordUpdateSchema), async (req, res) => {
  try {
    const { currentPassword, password } = req.body;

    const isEqual = await req.user.confirmPassword(currentPassword);
    if (!isEqual) return res.status(403).json({ message: 'Current password is not confirmed' });

    req.user.password = await User.encryptPassword(password);
    await req.user.save();

    if (!req.signedCookies?.refreshToken) return res.status(400).json({ message: 'No refresh token' });
    await RefreshToken.destroy({ where: { uuid: { [Op.not]: req.signedCookies.refreshToken.uuid } } });

    res.json({ message: 'Password was updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Some error occurred while updating the password');
  }
});

module.exports = router;
