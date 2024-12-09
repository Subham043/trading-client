import { SimpleGrid } from "@mantine/core";
import { FC } from "react";
import {
    IconBuildingBank,
    IconBuildingSkyscraper,
    IconCurrencyRupee,
    IconFilePercent,
    IconRegistered,
    IconStack3,
    IconUsersMinus,
} from '@tabler/icons-react';
import Stat from "../../components/Dashboard/stat";
import { useDashboardQuery } from "../../hooks/data/dashboard";

const DashboardPage:FC = () => {
    const {data, isLoading, isFetching} = useDashboardQuery();

    return (
        <div>
            <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
                <Stat Icon={IconBuildingSkyscraper} title="Total Company Masters" count={data ? data.totalCompanyMasters : 0} loading={isLoading || isFetching} />
                <Stat Icon={IconRegistered} title="Total Registrar Masters" count={data ? data.totalRegistrarMasters : 0} loading={isLoading || isFetching} />
                <Stat Icon={IconUsersMinus} title="Total Projects" count={data ? data.totalProjects : 0} loading={isLoading || isFetching} />
                <Stat Icon={IconStack3} title="Total Consolidated Holdings" count={data ? data.totalShares : 0} loading={isLoading || isFetching} />
                <Stat Icon={IconBuildingBank} title="Total Valuation In NSE" count={data ? data.totalValuationInNse : 0} loading={isLoading || isFetching} />
                <Stat Icon={IconBuildingBank} title="Total Valuation In BSE" count={data ? data.totalValuationInBse : 0} loading={isLoading || isFetching} />
                <Stat Icon={IconFilePercent} title="Total Projects Valuation" count={data ? data.totalValuation : 0} loading={isLoading || isFetching} />
                <Stat Icon={IconCurrencyRupee} title="Total Paid" count={data ? data.totalPaid : 0} loading={isLoading || isFetching} />
            </SimpleGrid>
        </div>
    )
}

export default DashboardPage;