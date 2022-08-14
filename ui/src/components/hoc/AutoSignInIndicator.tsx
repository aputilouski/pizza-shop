import { useStore } from 'redux-manager';

const AutoSignInIndicator = ({ children }: { children: JSX.Element }) => {
  const loading = useStore(state => state.auth.pendingAuth);
  return (
    <>
      {loading && (
        <div className="absolute w-full h-full bg-neutral-100/50">
          <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ">Loading...</p>
        </div>
      )}
      {children}
    </>
  );
};

export default AutoSignInIndicator;
