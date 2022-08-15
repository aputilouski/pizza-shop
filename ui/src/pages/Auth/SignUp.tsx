import { Link } from 'react-router-dom';
import { signUp, useStore, SIGN_UP } from 'redux-manager';
import { scheme } from 'utils';
import { Button, TextInput, Alert, LoadingOverlay } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';

const SignUp = () => {
  const form = useForm({
    initialValues: { username: '', name: '', password: '', confirmPassword: '' },
    validate: yupResolver(
      scheme.object({
        name: scheme.name,
        username: scheme.username,
        password: scheme.password,
        confirmPassword: scheme.confirmPassword,
      })
    ),
  });

  const { loading, errorMessage } = useStore(s => s.auth);

  return (
    <div className="w-screen h-screen flex">
      <form //
        onSubmit={form.onSubmit(signUp)}
        className="max-w-sm w-full m-auto flex flex-col gap-3.5 p-4 pb-20">
        <LoadingOverlay visible={loading} overlayBlur={2} />

        <h1 className="text-2xl mb-1.5">Sign Up</h1>

        <TextInput //
          name="username"
          placeholder="Username"
          autoComplete="off"
          {...form.getInputProps('username')}
        />

        <TextInput //
          name="name"
          placeholder="Name"
          autoComplete="off"
          {...form.getInputProps('name')}
        />

        <TextInput //
          name="password"
          placeholder="Password"
          type="password"
          className="border"
          autoComplete="off"
          {...form.getInputProps('password')}
        />

        <TextInput //
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          autoComplete="off"
          {...form.getInputProps('confirmPassword')}
        />

        {errorMessage[SIGN_UP] && <Alert color="red">{errorMessage[SIGN_UP]}</Alert>}

        <Button type="submit" disabled={loading}>
          Sign Up
        </Button>

        <Button component={Link} to="/" replace disabled={loading} variant="outline">
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
