import { Group, Loader, Paper, Text } from "@mantine/core";
import { FC, ForwardRefExoticComponent, RefAttributes } from "react";
import classes from './stat.module.css';
import {
    Icon,
    IconProps,
} from '@tabler/icons-react';

interface StatProps {
  Icon: ForwardRefExoticComponent<Omit<IconProps, "ref"> & RefAttributes<Icon>>;
  title: string;
  count: number|string;
  loading?: boolean;
}

const Stat:FC<StatProps> = ({ Icon, title, count, loading }) => {
    return (
        <Paper withBorder p="md" radius="md" bg="blue">
            <Group justify="space-between">
                <Text size="xs" className={classes.title}>
                    {title}
                </Text>
                <Icon className={classes.icon} size="1.4rem" stroke={1.5} />
            </Group>

            <Group align="flex-end" gap="xs" mt={5}>
                {loading && <Loader size={23} color="white" />}
                {!loading && <Text className={classes.value}>{count}</Text>}
            </Group>
        </Paper>
    )
}

export default Stat;