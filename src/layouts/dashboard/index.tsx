import { FC } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Container, Grid, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AccountModal from "../../components/AccountModal";


const DashboardLayout:FC = () => {

    const [opened, { toggle }] = useDisclosure(true);
    const [accountModalOpened, accountModalToggle] = useDisclosure(false);

    return (
        <>
            <div style={{ width: '100%', position: 'relative'}}>
                <Grid maw='100%' w='100%' overflow="hidden">
                    {opened && <Grid.Col span={2} px={0} pb={0}>
                        <Sidebar/>
                    </Grid.Col>}
                    <Grid.Col style={{ position: 'relative', minHeight: opened ? '100%' : rem('101vh')}} span={opened ? 10 : 12} px={0}>
                        <Header opened={opened} toggle={toggle} accountModalOpen={accountModalToggle.open} />
                        <Container size='98%'>
                            <Outlet />
                        </Container>
                        <Footer />
                        <AccountModal opened={accountModalOpened} close={accountModalToggle.close} />
                    </Grid.Col>
                </Grid>
            </div>
        </>
    )
}

export default DashboardLayout;