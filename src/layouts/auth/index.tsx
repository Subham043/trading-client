import {
    Container,
    Center,
    Grid,
} from '@mantine/core';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout:FC = () => {

    return (
        <>
            <Container size='lg'>
                <Center maw='100%' w='100%' h='100%' mih='80vh' my={40}>
                    <Grid
                        justify="center"
                        align="center"
                        w='100%'
                    >
                        <Grid.Col span={5}>
                            <Outlet /> 
                        </Grid.Col>
                    </Grid>
                </Center>
            </Container>
        </>
    )
}

export default AuthLayout
