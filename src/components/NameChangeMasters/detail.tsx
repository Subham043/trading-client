import { FC } from "react"
import { LoadingOverlay, Box, Table } from '@mantine/core';
import { DrawerProps } from "../../pages/nameChangeMasters/list";
import { useNameChangeMaster } from "../../hooks/data/name_change_masters";
import dayjs from "dayjs";

const NameChangeMasterDetail:FC<DrawerProps> = (props) => {
  const {data, isFetching, isLoading} = useNameChangeMaster(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <Box pos="relative" bg="transparent">
        <LoadingOverlay visible={isLoading || isFetching} zIndex={30} overlayProps={{ radius: "sm", blur: 2 }} />
        {(data) && <>
            <Table.ScrollContainer minWidth={'100%'}>
                <Table verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>NSE</Table.Th>
                            <Table.Td>{data.NSE}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>BSE</Table.Th>
                            <Table.Td>{data.BSE}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>New Name</Table.Th>
                            <Table.Td>{data.newName}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Previous Name</Table.Th>
                            <Table.Td>{data.previousName}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Date of Name Change</Table.Th>
                            <Table.Td>{data.dateNameChange && dayjs(data.dateNameChange.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>New RTA</Table.Th>
                            <Table.Td>{data.newRTA}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Previous RTA</Table.Th>
                            <Table.Td>{data.previousRTA}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Date of RTA Change</Table.Th>
                            <Table.Td>{data.dateRTAChange && dayjs(data.dateRTAChange.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>New Security Symbol</Table.Th>
                            <Table.Td>{data.newSecuritySymbol}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Old Security Symbol</Table.Th>
                            <Table.Td>{data.oldSecuritySymbol}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Date of Security Change</Table.Th>
                            <Table.Td>{data.dateSecurityChange && dayjs(data.dateSecurityChange.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                        </Table.Tr>
                    </Table.Thead>
                </Table>
            </Table.ScrollContainer>
        </>}
    </Box>
  );
}

export default NameChangeMasterDetail