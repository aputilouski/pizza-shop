import Header from 'pages/Main/Header';

const Layout = ({ children }: { children: JSX.Element }) => (
  <main className="max-w-screen-xl mx-auto flex flex-col divide-y-2 border-2">
    <Header />
    <div className="grow relative">{children}</div>
  </main>
);

export default Layout;
