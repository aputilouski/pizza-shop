import * as Yup from 'yup';

const name = Yup.string().min(4, 'Must be 4 characters or more').max(40, 'Must be 40 characters or less').required('Required');
const username = Yup.string().min(4, 'Must be 4 characters or more').max(20, 'Must be 20 characters or less').required('Required');
const password = Yup.string().min(8, 'Must be 8 characters or more').max(20, 'Must be 20 characters or less').required('Required');
const confirmPassword = Yup.string()
  .oneOf([Yup.ref('password')], 'Passwords must match')
  .required('Required');

export const scheme = {
  object: Yup.object,
  name,
  username,
  password,
  confirmPassword,
};
