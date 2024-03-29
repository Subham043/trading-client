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
import { useState } from 'react';
import { useToast } from '../../../hooks/useToast';
import api from '../../../utils/axios';
import { api_routes } from '../../../utils/api_routes';

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email'),
});

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const {toastError, toastSuccess} = useToast();

    const form = useForm({
        initialValues: {
            email: '',
        },
        validate: yupResolver(schema),
    });

    const onSubmit = async () => {
        setLoading(true);
        try {
            const response = await api.post<{message:string}>(api_routes.auth.forgot_password, form.values);
            toastSuccess(response.data.message);
            form.reset();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            if(error?.response?.data?.formErrors?.email){
                form.setFieldError('email', error.response.data.formErrors?.email[0]);
            }else if(error?.response?.data?.message){
                toastError(error.response.data.message);
            }else{
                toastError('Something went wrong.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Title ta="center">
                Forgot your password?
            </Title>
            <Text c="dimmed" fz="sm" ta="center">
                Enter your email to get a reset link
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                <form onSubmit={form.onSubmit(onSubmit)}>
                    <TextInput withAsterisk label="Your email" placeholder="me@mantine.dev" {...form.getInputProps('email')} />
                    <Group justify="space-between" mt="lg">
                        <Link to={page_routes.auth.login}>
                            <Center inline c="dimmed">
                                <IconArrowLeft style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                                <Text ml={5} size='sm'>Back to the login page</Text>
                            </Center>
                        </Link>
                        <Button type='submit' loading={loading} disabled={loading} data-disabled={loading}>Reset password</Button>
                    </Group>
                </form>
            </Paper>
        </>
    )
}

export default ForgotPasswordPage
