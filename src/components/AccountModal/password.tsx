import { Button, Group, PasswordInput } from "@mantine/core";
import { FC, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { useAxios } from "../../hooks/useAxios";
import { api_routes } from "../../utils/api_routes";
import * as yup from 'yup';


const schema = yup.object().shape({
  current_password: yup
    .string()
    .required('New Password is required'),
  password: yup
    .string()
    .required('New Password is required'),
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref("password")], "Passwords must match"),
});

type PasswordUpdateProps = {
    close: () => void;
}
const PasswordUpdate:FC<PasswordUpdateProps> = ({close}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const {axios} = useAxios();
    const {toastError, toastSuccess} = useToast();
    const form = useForm({
        initialValues: {
            current_password: '',
            password: '',
            confirm_password: '',
        },
        validate: yupResolver(schema),
    });

    const onSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.put<{message:string}>(api_routes.account.password, form.values);
            toastSuccess(response.data.message);
            form.reset();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            if(error?.response?.data?.formErrors?.current_password){
                form.setFieldError('current_password', error.response.data.formErrors?.current_password[0]);
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
            <PasswordInput label="Current Password" placeholder="Current password" withAsterisk mt="md" {...form.getInputProps('current_password')} />
            <PasswordInput label="New Password" placeholder="New password" withAsterisk mt="md" {...form.getInputProps('password')} />
            <PasswordInput label="Confirm Password" placeholder="Confirm password" withAsterisk mt="md" {...form.getInputProps('confirm_password')} />
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

export default PasswordUpdate