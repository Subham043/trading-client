import { FC } from "react"
import { Table, Group, Text, ActionIcon, rem } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { NameChangeMasterType } from "../../utils/types";
import { Link, useSearchParams } from "react-router-dom";
import dayjs from 'dayjs';
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { page_routes } from "../../utils/page_routes";
import { useNameChangeMastersMain } from "../../hooks/data/name_change_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";


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
  const [searchParams] = useSearchParams();
  const {data:nameChangeMasters, isFetching, isLoading, status, error, refetch} = useNameChangeMastersMain({page: searchParams.get('page') || QueryInitialPageParam.toString(), limit: searchParams.get('limit') || QueryTotalCount.toString(), search: searchParams.get('search') || ''});
  return (
    <ErrorBoundary hasData={nameChangeMasters ? nameChangeMasters.nameChangeMaster.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} current_page={nameChangeMasters?.current_page} last_page={nameChangeMasters?.last_page} refetch={refetch}>
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
    </ErrorBoundary>
  );
}

export default NameChangeMasterMainTable