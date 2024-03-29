import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Box, Button, LoadingOverlay, PasswordInput, TextInput } from "@mantine/core";
import * as yup from 'yup';
import { useAddUserQuery, useUpdateUserQuery, useUserQuery } from "../../hooks/data/useUserQuery";
import { AxiosError } from "axios";


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
    .required('Password is required'),
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref("password")], "Passwords must match"),
});


type UserFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
const UserForm:FC<UserFormProps> = (props) => {

    const [loading, setLoading] = useState<boolean>(false);
    const {toastError, toastSuccess} = useToast();
    const {data, isFetching, isLoading} = useUserQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addUser = useAddUserQuery()
    const updateUser = useUpdateUserQuery(props.type === "Edit" ? props.id : 0)
    const form = useForm({
        initialValues: {
            email: '',
            name: '',
            password: '',
            confirm_password: '',
        },
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.initialize({
                email: data.email,
                name: data.name,
                password: '',
                confirm_password: '',
            });
        }
    }, [data, props.type]);

    const onSubmit = async () => {
        setLoading(true);
        const userMutateOptions = {
            onSuccess: () => toastSuccess("User " + props.type === "Edit" ? "updated" : "created" + " successfully."),
            onError: (error:Error) => {
                if(error instanceof AxiosError){
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
                    }
                }else{
                    toastError('Something went wrong. Please try again later.');
                }
            },
            onSettled: () => setLoading(false)
        }
        if(props.type === "Edit"){
            updateUser.mutateAsync(
                {...form.values},
                {
                    onError: (error) => userMutateOptions.onError(error), 
                    onSuccess: () => userMutateOptions.onSuccess(), 
                    onSettled: () => userMutateOptions.onSettled(),
                }
            );
        }else{
            addUser.mutateAsync(
                {...form.values},
                {
                    onError: (error) => userMutateOptions.onError(error), 
                    onSuccess: () => userMutateOptions.onSuccess(), 
                    onSettled: () => userMutateOptions.onSettled(),
                }
            );
        }
    };

    return (
        <Box pos="relative">
            <LoadingOverlay visible={isLoading || isFetching} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <form onSubmit={form.onSubmit(onSubmit)}>
                <TextInput withAsterisk data-autofocus label="Name" placeholder="mantine dev" {...form.getInputProps('name')} mt="md" />
                <TextInput withAsterisk label="Email" placeholder="you@mantine.dev" {...form.getInputProps('email')} mt="md" />
                <PasswordInput label="Password" placeholder="Password" withAsterisk mt="md" {...form.getInputProps('password')} />
                <PasswordInput label="Confirm Password" placeholder="Confirm password" withAsterisk mt="md" {...form.getInputProps('confirm_password')} />
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={loading} disabled={loading} data-disabled={loading}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </Box>
    )
}

export default UserForm