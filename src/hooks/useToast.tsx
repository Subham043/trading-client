import { notifications } from '@mantine/notifications';

/*
  * Toast Hook Type
*/
type ToastHookType = () => {
    toastSuccess:(msg:string)=>void;
    toastError:(msg:string)=>void;
    toastInfo:(msg:string)=>void;
}


/*
  Toast Hook Function: This hook is used to have common toast configs at one place
*/
export const useToast:ToastHookType = () => {
    const toastSuccess = (msg:string) => {
        notifications.clean();
        notifications.show({
            color: 'green',
            title: 'Success',
            message: msg,
            autoClose: 5000,
            loading: false,
        });
    }
    const toastError = (msg:string) =>  {
        notifications.clean();
        notifications.show({
            color: 'red',
            title: 'Error',
            message: msg,
            autoClose: 5000,
            loading: false,
        });
    }
    const toastInfo = (msg:string) =>  {
        notifications.clean();
        notifications.show({
            color: 'blue',
            title: 'Info',
            message: msg,
            autoClose: 5000,
            loading: false,
        });
    }

    return {
        toastSuccess,
        toastError,
        toastInfo
    };
}