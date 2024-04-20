import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddUserMutation, useUpdateUserMutation, useUserQuery } from "../../hooks/data/users";
import { UserDrawerProps } from "../../pages/users";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, UserQueryType } from "../../utils/types";
import { SchemaType, createSchema, updateSchema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";


type UserFormProps = UserDrawerProps;
type userMutateOptionsType = MutateOptions<UserQueryType, Error, SchemaType, unknown>;
const UserForm:FC<UserFormProps & {toggleDrawer: (value: UserDrawerProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error, refetch} = useUserQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addUser = useAddUserMutation()
    const updateUser = useUpdateUserMutation(props.type === "Edit" ? props.id : 0)
    const form = useForm<SchemaType>({
        validate: yupResolver(props.type === "Edit" ? updateSchema : createSchema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                email: data.email,
                name: data.name,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const userMutateOptions:userMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleDrawer({status: false, type: 'Create'});
            },
            onError: (error:Error) => {
                if(isAxiosError<AxiosErrorResponseType>(error)){
                    if(error?.response?.data?.formErrors){
                        for (const [key, value] of Object.entries(error?.response?.data?.formErrors)) {
                            form.setFieldError(key, value[0]);
                        }
                    }else if(error?.response?.data?.message){
                        toastError(error.response.data.message);
                    }
                }
            }
        }
        if(props.type === "Edit"){
            await updateUser.mutateAsync(form.values, userMutateOptions);
        }else{
            await addUser.mutateAsync(form.values, userMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false) : true} isLoading={isLoading || isFetching} status={props.status && props.type==="Edit" ? status : "success"} error={error} hasPagination={false} refetch={refetch}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <TextInput withAsterisk data-autofocus label="Name" placeholder="mantine dev" {...form.getInputProps('name')} />
                <TextInput withAsterisk label="Email" placeholder="you@mantine.dev" {...form.getInputProps('email')} mt="md" />
                {
                    props.type === "Create" && <>
                        <PasswordInput label="Password" placeholder="Password" withAsterisk mt="md" {...form.getInputProps('password')} />
                        <PasswordInput label="Confirm Password" placeholder="Confirm password" withAsterisk mt="md" {...form.getInputProps('confirm_password')} />
                    </>
                }
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addUser.isPending : updateUser.isPending} disabled={props.type === "Create" ? addUser.isPending : updateUser.isPending} data-disabled={props.type === "Create" ? addUser.isPending : updateUser.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default UserForm