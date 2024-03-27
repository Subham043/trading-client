import {
    TextInput,
    Paper,
    Title,
    Group,
    Button,
    Center,
    rem,
    Text,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { page_routes } from '../../../utils/page_routes';
import { Link } from 'react-router-dom';
import { yupResolver } from 'mantine-form-yup-resolver';
import * as yup from 'yup';
import { useForm } from '@mantine/form';

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email'),
});

const ForgotPasswordPage = () => {

    const form = useForm({
        initialValues: {
            email: '',
        },
        validate: yupResolver(schema),
    });

    return (
        <>
            <Title ta="center">
                Forgot your password?
            </Title>
            <Text c="dimmed" fz="sm" ta="center">
                Enter your email to get a reset link
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                <form onSubmit={form.onSubmit((values) => console.log(values))}>
                    <TextInput withAsterisk label="Your email" placeholder="me@mantine.dev" {...form.getInputProps('email')} />
                    <Group justify="space-between" mt="lg">
                        <Link to={page_routes.auth.login}>
                            <Center inline c="dimmed">
                                <IconArrowLeft style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                                <Text ml={5} size='sm'>Back to the login page</Text>
                            </Center>
                        </Link>
                        <Button type='submit'>Reset password</Button>
                    </Group>
                </form>
            </Paper>
        </>
    )
}

export default ForgotPasswordPage
