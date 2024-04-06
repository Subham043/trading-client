import { FC } from "react"
import { Table, Group, Text, ActionIcon, rem, Center, Pagination, LoadingOverlay, Box } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { NameChangeMasterType } from "../../utils/types";
import { Link, useSearchParams } from "react-router-dom";
import dayjs from 'dayjs';
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { page_routes } from "../../utils/page_routes";
import { useNameChangeMastersMain } from "../../hooks/data/name_change_masters";


const NameChangeMasterMainTableRow:FC<NameChangeMasterType & {
    CIN?: string | null | undefined;
    ISIN?: string | null | undefined;
    faceValue?: number | null | undefined;
  }> = ({ISIN, CIN, faceValue, newName, BSE, NSE, newSecuritySymbol, companyId, createdAt}) => {
  
  return (
    <Table.Tr>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {ISIN}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {newName}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {CIN}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {faceValue}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {BSE}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {NSE}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {newSecuritySymbol}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dayjs(createdAt.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <Link to={`${page_routes.companyMasters.list}/${companyId}`}>
              <ActionIcon  variant="subtle" color="gray">
                  <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              </ActionIcon>
            </Link>
          </Group>
      </Table.Td>
    </Table.Tr>
  )
}

const NameChangeMasterMainTable:FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {data:nameChangeMasters, isFetching, isLoading} = useNameChangeMastersMain({page: searchParams.get('page') || QueryInitialPageParam.toString(), limit: searchParams.get('limit') || QueryTotalCount.toString(), search: searchParams.get('search') || ''});
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading || isFetching} zIndex={30} overlayProps={{ radius: "sm", blur: 2 }} />
      {(nameChangeMasters && nameChangeMasters.nameChangeMaster.length>0) ? <>
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ISIN</Table.Th>
                <Table.Th>New Name</Table.Th>
                <Table.Th>CIN</Table.Th>
                <Table.Th>Face Value</Table.Th>
                <Table.Th>BSE</Table.Th>
                <Table.Th>NSE</Table.Th>
                <Table.Th>New Security Symbol</Table.Th>
                <Table.Th>Created On</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{
              (nameChangeMasters ? nameChangeMasters.nameChangeMaster : []).map((item) => <NameChangeMasterMainTableRow key={item.id} {...item} />)
            }</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        <Center mt="md" pb="sm">
          <Pagination value={nameChangeMasters?.current_page || 10} total={nameChangeMasters?.last_page || 10} onChange={(page) => setSearchParams(page ? {page: page.toString(), limit: searchParams.get('limit') || QueryTotalCount.toString(), search: searchParams.get('search') || ''} : {})} />
        </Center>
      </>: 
      <Center mt="md" pb="sm" pt="sm">
        <Text>No data found</Text>
      </Center>}
    </Box>
  );
}

export default NameChangeMasterMainTable