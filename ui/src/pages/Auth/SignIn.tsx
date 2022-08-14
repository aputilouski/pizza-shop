import React from 'react';
import { Link } from 'react-router-dom';
import { signIn, useStore, SIGN_IN } from 'redux-manager';
import { useFormik } from 'formik';
import { ErrorMessage } from 'components';
import { scheme } from 'utils';
import clsx from 'clsx';

const SignIn = () => {
  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: scheme.object({ username: scheme.username, password: scheme.password }),
    onSubmit: signIn,
  });

  const { loading, errorMessage } = useStore(s => s.auth);

  const setSubmitting = formik.setSubmitting;
  React.useEffect(() => {
    if (!loading) setSubmitting(false);
  }, [loading, setSubmitting]);

  return (
    <div className="w-screen h-screen flex">
      <form //
        onSubmit={formik.handleSubmit}
        className="max-w-sm w-full m-auto flex flex-col gap-3.5 p-4">
        <h1 className="text-2xl mb-1.5">Sign In</h1>

        <input //
          name="username"
          placeholder="Username"
          className="border"
          autoComplete="username"
          onChange={formik.handleChange}
          value={formik.values.username}
          onBlur={formik.handleBlur}
        />
        <ErrorMessage>{formik.touched.username ? formik.errors.username : undefined}</ErrorMessage>

        <input //
          name="password"
          placeholder="Password"
          type="password"
          className="border"
          autoComplete="current-password"
          onChange={formik.handleChange}
          value={formik.values.password}
          onBlur={formik.handleBlur}
        />
        <ErrorMessage>{formik.touched.password ? formik.errors.password : undefined}</ErrorMessage>

        <ErrorMessage>{errorMessage[SIGN_IN]}</ErrorMessage>

        <button type="submit" disabled={formik.isSubmitting}>
          Sign In
        </button>

        <div className={clsx('text-center', formik.isSubmitting && 'pointer-events-none ')}>
          <Link to="/sign-up" replace>
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
