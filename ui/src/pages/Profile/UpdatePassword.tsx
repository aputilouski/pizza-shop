import React from 'react';
import { useFormik } from 'formik';
import { ErrorMessage } from 'components';
import { updatePassword, useStore, PASSWORD_UPDATE } from 'redux-manager';
import { scheme } from 'utils';

const UpdatePassword = () => {
  const { loading, errorMessage } = useStore(s => s.auth);

  const formik = useFormik({
    initialValues: { currentPassword: '', password: '', confirmPassword: '' },
    validationSchema: scheme.object({
      currentPassword: scheme.password,
      password: scheme.password,
      confirmPassword: scheme.confirmPassword,
    }),
    onSubmit: updatePassword,
  });

  const setSubmitting = formik.setSubmitting;
  const resetForm = formik.resetForm;
  React.useEffect(() => {
    if (!loading) {
      setSubmitting(false);
      resetForm();
    }
  }, [loading, setSubmitting, resetForm]);

  return (
    <form //
      onSubmit={formik.handleSubmit}
      className="max-w-sm w-full m-auto flex flex-col gap-3.5 p-4">
      <h1 className="text-2xl mb-1.5">Update Password</h1>

      <input //
        name="currentPassword"
        placeholder="Current Password"
        type="password"
        className="border"
        autoComplete="off"
        onChange={formik.handleChange}
        value={formik.values.currentPassword}
        onBlur={formik.handleBlur}
      />
      <ErrorMessage>{formik.errors.currentPassword}</ErrorMessage>

      <input //
        name="password"
        placeholder="Password"
        type="password"
        className="border"
        autoComplete="off"
        onChange={formik.handleChange}
        value={formik.values.password}
        onBlur={formik.handleBlur}
      />
      <ErrorMessage>{formik.errors.password}</ErrorMessage>

      <input //
        name="confirmPassword"
        placeholder="Confirm Password"
        type="password"
        className="border"
        autoComplete="off"
        onChange={formik.handleChange}
        value={formik.values.confirmPassword}
        onBlur={formik.handleBlur}
      />
      <ErrorMessage>{formik.errors.confirmPassword}</ErrorMessage>

      <ErrorMessage>{errorMessage[PASSWORD_UPDATE]}</ErrorMessage>

      <button type="submit" disabled={formik.isSubmitting}>
        Update Password
      </button>
    </form>
  );
};

export default UpdatePassword;
