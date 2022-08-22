import { AppShell, Navbar, UnstyledButton, Group, ThemeIcon, Text, Avatar, Button } from '@mantine/core';
import { IconPizza, IconList, IconUsers, IconChartLine } from '@tabler/icons';
import { Link, useRouteMatch } from 'react-router-dom';
import { signOut } from 'redux-manager';
import clsx from 'clsx';

type MainLinkProps = {
  label: string;
  icon: React.ReactNode;
  to: string;
  active: boolean;
};

const MainLink = ({ label, icon, to, active = false }: MainLinkProps) => (
  <UnstyledButton component={Link} to={to} className={clsx('inline-block', active && 'bg-gray-200')}>
    <Group>
      <ThemeIcon variant="light">{icon}</ThemeIcon>
      <Text size="sm">{label}</Text>
    </Group>
  </UnstyledButton>
);

const ProfileButton = ({ to }: { to: string }) => (
  <UnstyledButton component={Link} to={to}>
    <Group>
      <Avatar size={40} color="blue">
        BH
      </Avatar>
      <div>
        <Text>Bob Handsome</Text>
        <Text size="xs" color="dimmed">
          bob@handsome.inc
        </Text>
      </div>
    </Group>
  </UnstyledButton>
);

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
              <MainLink label="Main" icon={<IconChartLine />} to="/admin/main" active={url === '/admin/main'} />
              <MainLink label="Producs" icon={<IconPizza />} to="/admin/products" active={url === '/admin/products'} />
              <MainLink label="Orders" icon={<IconList />} to="/admin/orders" active={url === '/admin/orders'} />
              <MainLink label="Team" icon={<IconUsers />} to="/admin/team" active={url === '/admin/team'} />
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
