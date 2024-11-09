import { FC } from "react"
import { Image, Table, Title } from '@mantine/core';
import ErrorBoundary from "../Layout/ErrorBoundary";
import { api_routes } from "../../utils/api_routes";
import dayjs from "dayjs";
import { env } from "../../utils/env";
import { CasesListDrawerProps } from "../../pages/cases/list";
import { useCaseInfoQuery } from "../../hooks/data/cases";

const CaseDetail:FC<CasesListDrawerProps> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useCaseInfoQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        {(data) && <Table.ScrollContainer minWidth={'100%'}>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Case Type</Table.Th>
                        <Table.Td>{data.caseType}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Folios</Table.Th>
                        <Table.Td>{data.foliosSet.map((folio) => folio.Folio).join(", ")}</Table.Td>
                    </Table.Tr>
                    {data.caseType.includes("Transmission") && <>
                        <Table.Tr>
                            <Table.Th colSpan={2}><Title order={5} style={{textAlign: 'center'}}>Transmission</Title></Table.Th>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Is soleholder deceased</Table.Th>
                            <Table.Td>{data.isDeceased}</Table.Td>
                        </Table.Tr>
                        {data.isDeceased==="Yes" && <>
                            <Table.Tr>
                                <Table.Th>Shareholder name as per Death Certificate</Table.Th>
                                <Table.Td>{data.shareholderNameDeath}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Relationship with Deceased</Table.Th>
                                <Table.Td>{data.deceasedRelationship}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Date of Death</Table.Th>
                                <Table.Td>{dayjs(data.dod?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Testate/Intestate</Table.Th>
                                <Table.Td>{data.isTestate}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Proof of sucession</Table.Th>
                                <Table.Td>{data.proofOfSucession}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Document</Table.Th>
                                <Table.Td>
                                    {data.document ? <Image
                                        radius="md"
                                        h={350}
                                        w={150}
                                        fit="contain"
                                        src={`${env.API_ENDPOINT}${api_routes.upload.images}/${data.document}`}
                                    /> : null}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Date of document</Table.Th>
                                <Table.Td>{dayjs(data.dateOfDocument?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                            </Table.Tr>
                        </>}
                        <Table.Tr>
                            <Table.Th>If claimant is minor</Table.Th>
                            <Table.Td>{data.isMinor}</Table.Td>
                        </Table.Tr>
                        {data.isMinor==="Yes" && <>
                            <Table.Tr>
                                <Table.Th>DOB of Minor</Table.Th>
                                <Table.Td>{dayjs(data.dobMinor?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Name of Guardian of minor</Table.Th>
                                <Table.Td>{data.guardianName}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Relationship of Guardian with Minor</Table.Th>
                                <Table.Td>{data.guardianRelationship}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>PAN of Guardian</Table.Th>
                                <Table.Td>{data.guardianPan}</Table.Td>
                            </Table.Tr>
                        </>}
                        <Table.Tr>
                            <Table.Th>Tax Status</Table.Th>
                            <Table.Td>{data.taxStatus}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Select Claimant</Table.Th>
                            <Table.Td>{data.clamaints.map((item) => item.shareholderName).join(", ")}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Claimant Status</Table.Th>
                            <Table.Td>{data.statusClaimant}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Claimant Percentage</Table.Th>
                            <Table.Td>{data.percentageClaimant}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Claimant Occupation</Table.Th>
                            <Table.Td>{data.occupationClaimant}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Claimant Political Exposure</Table.Th>
                            <Table.Td>{data.politicalExposureClaimant}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Claimant Annual Income</Table.Th>
                            <Table.Td>{data.annualIncomeClaimant}</Table.Td>
                        </Table.Tr>
                    </>}
                    {data.caseType.includes("Transposition") && <>
                        <Table.Tr>
                            <Table.Th colSpan={2}><Title order={5} style={{textAlign: 'center'}}>Transposition</Title></Table.Th>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Transposition Order</Table.Th>
                            <Table.Td>{data.order.map((item) => item.shareholderName).join(", ")}</Table.Td>
                        </Table.Tr>
                    </>}
                </Table.Thead>
            </Table>
        </Table.ScrollContainer>}
    </ErrorBoundary>
  );
}

export default CaseDetail