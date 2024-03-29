import {
    PasswordInput,
    Paper,
    Title,
    Button,
    Text,
} from '@mantine/core';
import { FC, useState } from 'react';
import { yupResolver } from 'mantine-form-yup-resolver';
import * as yup from 'yup';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../hooks/useToast';
import api from '../../../utils/axios';
import { api_routes } from '../../../utils/api_routes';
import { page_routes } from '../../../utils/page_routes';

const schema = yup.object().shape({
  password: yup
    .string()
    .required('New Password is required'),
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const ResetPasswordPage:FC = () => {
    const param = useParams<{key:string}>();
    const [loading, setLoading] = useState<boolean>(false);
    const {toastError, toastSuccess} = useToast();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            password: '',
            confirm_password: '',
        },
        validate: yupResolver(schema),
    });

    const onSubmit = async () => {
        setLoading(true);
        try {
            const response = await api.post<{message:string}>(api_routes.auth.reset_password + `/${param.key}`, form.values);
            toastSuccess(response.data.message);
            form.reset();
            navigate(page_routes.auth.login, {replace: true});
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            if(error?.response?.data?.formErrors?.password){
                form.setFieldError('password', error.response.data.formErrors?.password[0]);
            }else if(error?.response?.data?.formErrors?.confirm_password){
                form.setFieldError('confirm_password', error.response.data.formErrors?.confirm_password[0]);
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
                Reset your password!
            </Title>
            <Text c="dimmed" fz="sm" ta="center">
                Enter the following to reset your password
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(onSubmit)}>
                    <PasswordInput label="New Password" placeholder="New password" withAsterisk mt="md" {...form.getInputProps('password')} />
                    <PasswordInput label="Confirm Password" placeholder="Confirm password" withAsterisk mt="md" {...form.getInputProps('confirm_password')} />
                    <Button type='submit' variant="filled" color='blue' fullWidth mt="xl" loading={loading} disabled={loading} data-disabled={loading}>
                        Reset password
                    </Button>
                </form>
            </Paper>
        </>
    )
}

export default ResetPasswordPage
