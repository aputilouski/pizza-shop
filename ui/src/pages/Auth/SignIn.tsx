import { Link } from 'react-router-dom';
import { signIn, useStore, SIGN_IN } from 'redux-manager';
import { scheme } from 'utils';
import { Button, TextInput, Alert, LoadingOverlay } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';

const SignIn = () => {
  const form = useForm({
    initialValues: { username: '', password: '' },
    validate: yupResolver(scheme.object({ username: scheme.username, password: scheme.password })),
  });

  const { loading, errorMessage } = useStore(s => s.auth);

  return (
    <div className="w-screen h-screen flex relative">
      <form //
        onSubmit={form.onSubmit(signIn)}
        className="max-w-sm w-full m-auto flex flex-col gap-3.5 p-4 pb-20">
        <LoadingOverlay visible={loading} overlayBlur={2} />

        <h1 className="text-2xl mb-1.5">Sign In</h1>

        <TextInput //
          name="username"
          placeholder="Username"
          autoComplete="username"
          {...form.getInputProps('username')}
        />

        <TextInput //
          name="password"
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          {...form.getInputProps('password')}
        />

        {errorMessage[SIGN_IN] && <Alert color="red">{errorMessage[SIGN_IN]}</Alert>}

        <Button type="submit" disabled={loading}>
          Sign In
        </Button>

        <Button component={Link} to="/sign-up" replace disabled={loading} variant="outline">
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignIn;
