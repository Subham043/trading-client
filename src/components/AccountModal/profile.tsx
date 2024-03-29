import { Button, Group, TextInput } from "@mantine/core";
import { FC, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { useAxios } from "../../hooks/useAxios";
import { api_routes } from "../../utils/api_routes";
import * as yup from 'yup';


const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email'),
  name: yup
    .string()
    .required('Name is required')
});

type ProfileUpdateProps = {
    close: () => void;
}
const ProfileUpdate:FC<ProfileUpdateProps> = ({close}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const {user, setUser} = useUser();
    const {axios} = useAxios();
    const {toastError, toastSuccess} = useToast();
    const form = useForm({
        initialValues: {
            email: user ? user.email : '',
            name: user ? user.name : '',
        },
        validate: yupResolver(schema),
    });

    const onSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.put<{data:{email:string, name:string}, message:string}>(api_routes.account.profile, form.values);
            user && setUser({
                ...user,
                email: response.data.data.email,
                name: response.data.data.name
            });
            toastSuccess(response.data.message);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            if(error?.response?.data?.formErrors?.email){
                form.setFieldError('email', error.response.data.formErrors?.email[0]);
            }else if(error?.response?.data?.formErrors?.name){
                form.setFieldError('name', error.response.data.formErrors?.name[0]);
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
            <TextInput withAsterisk label="Name" placeholder="mantine dev" {...form.getInputProps('name')} mt="md" />
            <TextInput withAsterisk label="Email" placeholder="you@mantine.dev" {...form.getInputProps('email')} mt="md" />
            <Group mt="lg">
                <Button type='button' variant="filled" color='red' onClick={close}>
                    Cancel
                </Button>
                <Button type='submit' variant="filled" color='blue' loading={loading} disabled={loading} data-disabled={loading}>
                    Update
                </Button>
            </Group>
        </form>
    )
}

export default ProfileUpdate