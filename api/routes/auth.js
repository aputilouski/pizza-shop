const express = require('express');
const router = express.Router();
const yup = require('yup');
const { validate, verifyUser } = require('@middleware');
const { User } = require('@models');
const { strategies } = require('@config');

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

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Incorrect credentials' });

    const passwordConfirmed = await user.confirmPassword(password);
    if (!passwordConfirmed) return res.status(400).json({ message: 'Incorrect username or password' });

    if (req.signedCookies?.refreshToken) {
      const index = user.tokens.findIndex(t => t === req.signedCookies.refreshToken);
      if (index !== -1 && user.tokens[index] === req.signedCookies.refreshToken) user.tokens.splice(index, 1);
    }

    if (user.tokens.length > 4) user.tokens = tokens.filter((t, i) => i < 5);

    const refreshToken = strategies.generateRefreshToken({ id: user.id });
    user.tokens.unshift(refreshToken);
    res.cookie('refreshToken', refreshToken, strategies.COOKIE_OPTIONS);

    await user.save(); // save tokens

    res.json({ token: strategies.generateAccessToken({ id: user.id }), user: user.getPublicAttributes() });
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
      const payload = strategies.verifyRefreshToken(req.signedCookies.refreshToken);
      const user = await User.findById(payload.id);
      if (!user) return res.status(401).json({ message: 'User not found' });
      const index = user.tokens.findIndex(t => t === req.signedCookies.refreshToken);
      if (index === -1) return res.status(401).json({ message: 'Refresh token not found' });
      user.tokens.splice(index, 1);
      await user.save();
      const refreshToken = strategies.generateRefreshToken({ id: user.id });
      user.tokens.unshift(refreshToken);
      res.cookie('refreshToken', refreshToken, strategies.COOKIE_OPTIONS);
      await user.save();
      const result = { token: strategies.generateAccessToken({ id: user.id }) };
      if (withUser) result.user = user.getPublicAttributes();
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message || 'An error occurred while generating a new token');
    }
  };

router.post('/refresh-token', refreshToken());

router.post('/auto-sign-in', refreshToken(true));

router.post('/sign-out', verifyUser, async (req, res) => {
  if (req.signedCookies?.refreshToken) {
    const user = await User.findById(req.user.id);
    if (user) {
      user.tokens = user.tokens.filter(t => t !== req.signedCookies.refreshToken);
      await user.save();
    }
  }
  res.clearCookie('refreshToken');
  res.end();
});

const UserUpdateSchema = yup.object({ body: yup.object({ username: USERNAME, name: NAME }) });

router.post('/user', verifyUser, validate(UserUpdateSchema), async (req, res) => {
  try {
    const { name, username } = req.body;

    if (req.user.username !== username) {
      const user = await User.findOne({ username });
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
    if (!req.signedCookies?.refreshToken) return res.status(400).json({ message: 'No refresh token' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ message: 'User not found' });
    user.tokens = user.tokens.filter(t => t !== req.signedCookies.refreshToken);

    const { currentPassword, password } = req.body;

    const isEqual = await user.confirmPassword(currentPassword);
    if (!isEqual) return res.status(403).json({ message: 'Current password is not confirmed' });

    user.password = await User.encryptPassword(password);
    await req.user.save();

    res.json({ message: 'Password was updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Some error occurred while updating the password');
  }
});

module.exports = router;
