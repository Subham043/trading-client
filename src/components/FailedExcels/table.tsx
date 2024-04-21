import { FC } from "react"
import { Table, Group, Text, ActionIcon, rem } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { FailedExcelType } from "../../utils/types";
import dayjs from 'dayjs';
import { useDeleteFailedExcelMutation, useFailedExcelsQuery } from "../../hooks/data/failed_excels";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { useExcelExport } from "../../hooks/useExcelExport";
import { api_routes } from "../../utils/api_routes";


const FailedExcelTableRow:FC<FailedExcelType> = ({id, file_name, file_of, createdAt}) => {
  const { exportExcel, excelLoading } = useExcelExport();
  const {destroyFailedExcels} = useDeleteFailedExcelMutation(id)

  const onDelete = async () => {
    await exportExcel(api_routes.upload.failed_excel.download_via_id + `/${id}`, file_name);
    destroyFailedExcels();
  }
  return (
    <Table.Tr>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {id}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {file_name}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {file_of}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dayjs(createdAt ? createdAt.toString() : undefined).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <ActionIcon  variant="subtle" color="red" title="Download & Delete" onClick={onDelete} loading={excelLoading} disabled={excelLoading}>
                <IconDownload style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
          </Group>
      </Table.Td>
    </Table.Tr>
  )
}

const FailedExcelTable:FC = () => {
  const {data:failedExcels, isFetching, isLoading, status, error, refetch} = useFailedExcelsQuery();
  return (
    <>
      <ErrorBoundary hasData={failedExcels ? failedExcels.failedExcel.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} current_page={failedExcels?.current_page} last_page={failedExcels?.last_page} refetch={refetch}>
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
            <Table.Thead bg="blue">
              <Table.Tr>
                <Table.Th style={{color: 'white'}}>ID</Table.Th>
                <Table.Th style={{color: 'white'}}>File Name</Table.Th>
                <Table.Th style={{color: 'white'}}>File For</Table.Th>
                <Table.Th style={{color: 'white'}}>Created On</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{
              (failedExcels ? failedExcels.failedExcel : []).map((item) => <FailedExcelTableRow key={item.id} {...item} />)
            }</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ErrorBoundary>
    </>
  );
}

export default FailedExcelTable