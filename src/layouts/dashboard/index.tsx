import { FC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Container, Grid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AccountModal from "../../components/AccountModal";
import { useMediaQuery } from '@mantine/hooks';


const DashboardLayout:FC = () => {

    const matches = useMediaQuery('(max-width: 1100px)');
    const [opened, { open, close, toggle }] = useDisclosure(true);
    const [accountModalOpened, accountModalToggle] = useDisclosure(false);
    useEffect(() => {
        matches ? close() : open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matches])

    return (
        <>
            <div style={{ width: '100%'}}>
                {opened && <Sidebar opened={opened} toggle={toggle} />}
                <Grid maw='100%' w='100%' overflow="hidden" pos={'fixed'} top={0} left={0} style={{ zIndex: 10 }}>
                    <Grid.Col span={opened ? 10 : 12} offset={opened ? 2 : 0} px={0}>
                        <Header opened={opened} toggle={toggle} accountModalOpen={accountModalToggle.open} />
                    </Grid.Col>
                </Grid>
                <Grid maw='100%' w='100%' overflow="hidden" pb={90} pt={90}>
                    <Grid.Col span={opened ? 10 : 12} offset={opened ? 2 : 0} px={0}>
                        <Container size='98%'>
                            <Outlet />
                        </Container>
                        <AccountModal opened={accountModalOpened} close={accountModalToggle.close} />
                    </Grid.Col>
                </Grid>
                <Grid maw='100%' w='100%' overflow="hidden" pos={'fixed'} bottom={0} left={0} style={{ zIndex: 10 }}>
                    <Grid.Col span={opened ? 10 : 12} offset={opened ? 2 : 0} px={0}>
                        <Footer />
                    </Grid.Col>
                </Grid>
            </div>
        </>
    )
}

export default DashboardLayout;