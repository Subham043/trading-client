import { Modal } from "@mantine/core";
import { FC } from "react";
import { Tabs, rem } from '@mantine/core';
import { IconUserCircle, IconKey } from '@tabler/icons-react';
import ProfileUpdate from "./profile";
import PasswordUpdate from "./password";

type AccountModalProps = {
    opened: boolean;
    close: () => void;
}
const AccountModal:FC<AccountModalProps> = ({opened, close}) => {
    const iconStyle = { width: rem(12), height: rem(12) };
    return <>
        <Modal opened={opened} onClose={close} centered size="md" withCloseButton={false} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <Tabs defaultValue="profile">
                <Tabs.List>
                    <Tabs.Tab value="profile" leftSection={<IconUserCircle style={iconStyle} />}>
                        Profile
                    </Tabs.Tab>
                    <Tabs.Tab value="password" leftSection={<IconKey style={iconStyle} />}>
                        Password
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="profile">
                    <ProfileUpdate close={close} />
                </Tabs.Panel>

                <Tabs.Panel value="password">
                    <PasswordUpdate close={close} />
                </Tabs.Panel>
            </Tabs>
        </Modal>
    </>
}

export default AccountModal