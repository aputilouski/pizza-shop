import React from 'react';
import { useFormik } from 'formik';
import { ErrorMessage } from 'components';
import { useStore, updateUser, USER_UPDATE } from 'redux-manager';
import UpdatePassword from './UpdatePassword';
import { scheme } from 'utils';

const Profile = () => {
  const { loading, errorMessage, user } = useStore(s => s.auth);

  const formik = useFormik({
    initialValues: { username: user?.username || '', name: user?.name || '' },
    validationSchema: scheme.object({ username: scheme.username, name: scheme.name }),
    onSubmit: updateUser,
  });

  const setSubmitting = formik.setSubmitting;
  React.useEffect(() => {
    if (!loading) setSubmitting(false);
  }, [loading, setSubmitting]);

  if (!user) return null;
  return (
    <>
      <form //
        onSubmit={formik.handleSubmit}
        className="max-w-sm w-full m-auto flex flex-col gap-3.5 p-4">
        <h1 className="text-2xl mb-1.5">Profile</h1>

        <input //
          name="username"
          placeholder="Username"
          className="border"
          autoComplete="off"
          onChange={formik.handleChange}
          value={formik.values.username}
          onBlur={formik.handleBlur}
        />
        <ErrorMessage>{formik.errors.username}</ErrorMessage>

        <input //
          name="name"
          placeholder="Name"
          className="border"
          autoComplete="off"
          onChange={formik.handleChange}
          value={formik.values.name}
          onBlur={formik.handleBlur}
        />
        <ErrorMessage>{formik.errors.name}</ErrorMessage>

        <ErrorMessage>{errorMessage[USER_UPDATE]}</ErrorMessage>

        <button type="submit" disabled={formik.isSubmitting}>
          Save
        </button>
      </form>

      <UpdatePassword />
    </>
  );
};

export default Profile;
