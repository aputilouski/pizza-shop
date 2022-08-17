import React from 'react';
import { updatePassword, useStore, PASSWORD_UPDATE } from 'redux-manager';
import { scheme } from 'utils';
import { Button, TextInput, Alert } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';

const UpdatePassword = () => {
  const { loading, errorMessage } = useStore(s => s.auth);

  const form = useForm({
    initialValues: { currentPassword: '', password: '', confirmPassword: '' },
    validate: yupResolver(
      scheme.object({
        currentPassword: scheme.password,
        password: scheme.password,
        confirmPassword: scheme.confirmPassword,
      })
    ),
  });

  const resetForm = form.reset;
  React.useEffect(() => {
    if (!loading) resetForm();
  }, [loading, resetForm]);

  return (
    <form //
      onSubmit={form.onSubmit(updatePassword)}
      className="max-w-sm w-full m-auto flex flex-col gap-3.5 p-4">
      <h1 className="text-2xl mb-1.5">Update Password</h1>

      <TextInput //
        name="currentPassword"
        placeholder="Current Password"
        type="password"
        className="border"
        autoComplete="off"
        {...form.getInputProps('currentPassword')}
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
        className="border"
        autoComplete="off"
        {...form.getInputProps('confirmPassword')}
      />

      {errorMessage[PASSWORD_UPDATE] && <Alert color="red">{errorMessage[PASSWORD_UPDATE]}</Alert>}

      <Button type="submit" disabled={loading}>
        Update Password
      </Button>
    </form>
  );
};

export default UpdatePassword;
