import { useStore, updateUser, USER_UPDATE } from 'redux-manager';
import UpdatePassword from './UpdatePassword';
import { scheme } from 'utils';
import { useForm, yupResolver } from '@mantine/form';
import { Button, TextInput, Alert, LoadingOverlay } from '@mantine/core';

const Profile = () => {
  const { loading, errorMessage, user } = useStore(s => s.auth);
  const form = useForm({
    initialValues: { username: user?.username || '', name: user?.name || '' },
    validate: yupResolver(scheme.object({ username: scheme.username, name: scheme.name })),
  });

  if (!user) return null;
  return (
    <>
      <form //
        onSubmit={form.onSubmit(updateUser)}
        className="max-w-sm w-full m-auto flex flex-col gap-3.5 p-4">
        {/* This LoadingOverlay is used for both forms (this one and UpdatePassword) */}
        <LoadingOverlay visible={loading} overlayBlur={2} />

        <h1 className="text-2xl mb-1.5">Profile</h1>

        <TextInput //
          name="username"
          placeholder="Username"
          className="border"
          autoComplete="off"
          {...form.getInputProps('username')}
        />

        <TextInput //
          name="name"
          placeholder="Name"
          className="border"
          autoComplete="off"
          {...form.getInputProps('name')}
        />

        {errorMessage[USER_UPDATE] && <Alert color="red">{errorMessage[USER_UPDATE]}</Alert>}

        <Button type="submit" disabled={loading}>
          Save
        </Button>
      </form>

      <UpdatePassword />
    </>
  );
};

export default Profile;
