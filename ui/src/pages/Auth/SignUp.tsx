import React from 'react';
import { Link } from 'react-router-dom';
import { signUp, useStore, SIGN_UP } from 'redux-manager';
import { useFormik } from 'formik';
import { ErrorMessage } from 'components';
import { scheme } from 'utils';
import clsx from 'clsx';

const SignUp = () => {
  const formik = useFormik({
    initialValues: { username: '', name: '', password: '', confirmPassword: '' },
    validationSchema: scheme.object({
      name: scheme.name,
      username: scheme.username,
      password: scheme.password,
      confirmPassword: scheme.confirmPassword,
    }),
    onSubmit: signUp,
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
        <h1 className="text-2xl mb-1.5">Sign Up</h1>

        <input //
          name="username"
          placeholder="Username"
          className="border"
          autoComplete="off"
          onChange={formik.handleChange}
          value={formik.values.username}
          onBlur={formik.handleBlur}
        />
        <ErrorMessage>{formik.touched.username ? formik.errors.username : undefined}</ErrorMessage>

        <input //
          name="name"
          placeholder="Name"
          className="border"
          autoComplete="off"
          onChange={formik.handleChange}
          value={formik.values.name}
          onBlur={formik.handleBlur}
        />
        <ErrorMessage>{formik.touched.name ? formik.errors.name : undefined}</ErrorMessage>

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
        <ErrorMessage>{formik.touched.password ? formik.errors.password : undefined}</ErrorMessage>

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
        <ErrorMessage>{formik.touched.confirmPassword ? formik.errors.confirmPassword : undefined}</ErrorMessage>

        <ErrorMessage>{errorMessage[SIGN_UP]}</ErrorMessage>

        <button type="submit" disabled={formik.isSubmitting}>
          Sign Up
        </button>

        <div className={clsx('text-center', formik.isSubmitting && 'pointer-events-none ')}>
          <Link to="/" replace>
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
