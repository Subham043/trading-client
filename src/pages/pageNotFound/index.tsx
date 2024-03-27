import {
    Container,
    Center,
    Grid,
    Title,
    Text,
    Group,
    Button,
} from '@mantine/core';
import { FC } from 'react';
import classes from './pageNotFound.module.css';
import { Link } from 'react-router-dom';
import { page_routes } from '../../utils/page_routes';
import { useUser } from '../../hooks/useUser';

const PageNotFound:FC = () => {
    const {isAuthenticated} = useUser();
    return (
        <>
            <Container size='lg'>
                <Center maw='100%' w='100%' h='100%' mih='80vh' my={40}>
                    <Grid
                        justify="center"
                        align="center"
                        w='100%'
                    >
                        <Grid.Col span={8}>
                            <div className={classes.label}>404</div>
                            <Title className={classes.title}>Page Not Found.</Title>
                            <Text c="dimmed" size="lg" ta="center" className={classes.description}>
                                Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
                                been moved to another URL.
                            </Text>
                            <Group justify="center">
                                <Link to={isAuthenticated ? page_routes.dashboard : page_routes.auth.login}>
                                    <Button variant="subtle" size="md">
                                        Take me back to home page
                                    </Button>
                                </Link>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Center>
            </Container>
        </>
    )
}

export default PageNotFound
