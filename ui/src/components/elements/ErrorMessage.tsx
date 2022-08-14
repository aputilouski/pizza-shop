const ErrorMessage = ({ children }: { children?: string }) => {
  if (!children) return null;
  return <div className="text-sm">{children}</div>;
};

export default ErrorMessage;
