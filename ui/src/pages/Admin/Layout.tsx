import { AppShell, Navbar, UnstyledButton, Group, ThemeIcon, Text, Avatar, Button } from '@mantine/core';
import { IconPizza, IconList, IconChartLine } from '@tabler/icons';
import { Link, useRouteMatch } from 'react-router-dom';
import { signOut, useStore } from 'redux-manager';
import clsx from 'clsx';

type MainLinkProps = {
  label: string;
  icon: React.ReactNode;
  to: string;
  active: boolean;
};

const MainLink = ({ label, icon, to, active = false }: MainLinkProps) => (
  <UnstyledButton component={Link} to={to} className={clsx('inline-block rounded transition linear delay-150', active && 'bg-sky-100')}>
    <Group>
      <ThemeIcon variant="light" size={40}>
        {icon}
      </ThemeIcon>
      <Text size="sm">{label}</Text>
    </Group>
  </UnstyledButton>
);

const ProfileButton = ({ to }: { to: string }) => {
  const user = useStore(s => s.auth.user);
  return (
    <UnstyledButton component={Link} to={to}>
      <Group>
        <Avatar size={40} color="blue">
          {user?.name
            .split(' ')
            .map(str => str[0])
            .join('')}
        </Avatar>
        <div>
          <Text>{user?.name}</Text>
          <Text size="xs" color="dimmed">
            {user?.username}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );
};

const Layout = ({ children }: { children: JSX.Element }) => {
  const { url } = useRouteMatch();
  return (
    <AppShell
      navbar={
        <Navbar width={{ base: 288 }} p="lg">
          <Navbar.Section>
            <ProfileButton to="/admin/profile" />
          </Navbar.Section>
          <Navbar.Section grow mt="md">
            <div className="flex flex-col gap-2">
              <MainLink label="Statistics" icon={<IconChartLine />} to="/admin/stats" active={url === '/admin/stats'} />
              <MainLink label="Orders" icon={<IconList />} to="/admin/orders" active={url === '/admin/orders'} />
              <MainLink label="Producs" icon={<IconPizza />} to="/admin/products" active={url === '/admin/products'} />
            </div>
          </Navbar.Section>
          <Navbar.Section>
            <Button onClick={signOut}>Sign Out</Button>
          </Navbar.Section>
        </Navbar>
      }>
      {children}
    </AppShell>
  );
};

export default Layout;
