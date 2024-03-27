import {
    Container,
    Center,
    Grid,
    Loader,
} from '@mantine/core';
import { FC } from 'react';

const PageLoader:FC = () => {

    return (
        <>
            <Container size='lg'>
                <Center maw='100%' w='100%' h='100%' mih='80vh' my={40}>
                    <Grid
                        justify="center"
                        align="center"
                        w='100%'
                    >
                        <Grid.Col span={1}>
                            <Center maw='100%' w='100%' h='100%'>
                                <Loader color="blue" type="bars" />
                            </Center>
                        </Grid.Col>
                    </Grid>
                </Center>
            </Container>
        </>
    )
}

export default PageLoader
