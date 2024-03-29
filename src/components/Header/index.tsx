import cx from 'clsx';
import { FC, useState } from 'react';
import {
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Burger,
  rem,
} from '@mantine/core';
import {
  IconLogout,
  IconSettings,
  IconChevronDown,
} from '@tabler/icons-react';
import classes from './header.module.css';
import { useUser } from '../../hooks/useUser';
import { useAxios } from '../../hooks/useAxios';
import { api_routes } from '../../utils/api_routes';
import { useToast } from '../../hooks/useToast';

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}

const Header:FC<HeaderProps> = ({ opened, toggle }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {toastError, toastSuccess} = useToast();
  const {user, removeUser} = useUser();
  const {axios} = useAxios();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const initials = user?.name.split(' ').map((name) => name[0]).join('').toUpperCase();

  const onLogout = async () => {
        setLoading(true);
        try {
            const response = await axios.get<{message:string}>(api_routes.auth.logout);
            removeUser()
            toastSuccess(response.data.message);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            if(error?.response?.data?.message){
                toastError(error.response.data.message);
            }else{
                toastError('Invalid credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="xl">
        <Group justify="space-between">

          <Burger opened={opened} onClick={toggle} size="sm" />

          <Menu
            width={200}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
              >
                <Group gap={7}>
                  <Avatar radius="xl" color="blue" size={20}>{initials}</Avatar>
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    {user?.name}
                  </Text>
                  <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
              >
                Account settings
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                onClick={onLogout}
                disabled={loading}
              >
                Logout
              </Menu.Item>

            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
    </div>
  );
}

export default Header;