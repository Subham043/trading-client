import {
    PasswordInput,
    Paper,
    Title,
    Button,
    Text,
} from '@mantine/core';
import { FC } from 'react';
import { yupResolver } from 'mantine-form-yup-resolver';
import * as yup from 'yup';
import { useForm } from '@mantine/form';

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

    const form = useForm({
        initialValues: {
            password: '',
            confirm_password: '',
        },
        validate: yupResolver(schema),
    });

    return (
        <>
            <Title ta="center">
                Reset your password!
            </Title>
            <Text c="dimmed" fz="sm" ta="center">
                Enter the following to reset your password
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit((values) => console.log(values))}>
                    <PasswordInput label="New Password" placeholder="New password" withAsterisk mt="md" {...form.getInputProps('password')} />
                    <PasswordInput label="Confirm Password" placeholder="Confirm password" withAsterisk mt="md" {...form.getInputProps('confirm_password')} />
                    <Button type='submit' variant="filled" color='blue' fullWidth mt="xl">
                        Reset password
                    </Button>
                </form>
            </Paper>
        </>
    )
}

export default ResetPasswordPage
