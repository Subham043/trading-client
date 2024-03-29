import { FC, useState } from "react";
import { useAxios } from "../../hooks/useAxios";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { api_routes } from "../../utils/api_routes";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import * as yup from 'yup';


const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email'),
  name: yup
    .string()
    .required('Name is required'),
  password: yup
    .string()
    .required('New Password is required'),
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref("password")], "Passwords must match"),
});


// type UserFormProps = {}
const UserForm:FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const {axios} = useAxios();
    const {toastError, toastSuccess} = useToast();
    const form = useForm({
        initialValues: {
            email: '',
            name: '',
            password: '',
            confirm_password: '',
        },
        validate: yupResolver(schema),
    });

    const onSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.put<{data:{email:string, name:string}, message:string}>(api_routes.users, form.values);
            toastSuccess(response.data.message);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            if(error?.response?.data?.formErrors?.email){
                form.setFieldError('email', error.response.data.formErrors?.email[0]);
            }else if(error?.response?.data?.formErrors?.name){
                form.setFieldError('name', error.response.data.formErrors?.name[0]);
            }else if(error?.response?.data?.formErrors?.password){
                form.setFieldError('password', error.response.data.formErrors?.password[0]);
            }else if(error?.response?.data?.formErrors?.confirm_password){
                form.setFieldError('confirm_password', error.response.data.formErrors?.confirm_password[0]);
            }else if(error?.response?.data?.message){
                toastError(error.response.data.message);
            }else{
                toastError('Something went wrong. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <TextInput withAsterisk data-autofocus label="Name" placeholder="mantine dev" {...form.getInputProps('name')} mt="md" />
            <TextInput withAsterisk label="Email" placeholder="you@mantine.dev" {...form.getInputProps('email')} mt="md" />
            <PasswordInput label="Password" placeholder="Password" withAsterisk mt="md" {...form.getInputProps('password')} />
            <PasswordInput label="Confirm Password" placeholder="Confirm password" withAsterisk mt="md" {...form.getInputProps('confirm_password')} />
            <Button type='submit' variant="filled" color='blue' mt="md" loading={loading} disabled={loading} data-disabled={loading}>
                Create
            </Button>
        </form>
    )
}

export default UserForm