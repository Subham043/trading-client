import { FC } from "react"
import { Table, Title } from '@mantine/core';
import { ShareHolderDetailsListDrawerProps } from "../../pages/shareHolderDetails/list";
import { useShareHolderDetailQuery } from "../../hooks/data/share_holder_details";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";
import { ShareHolderMasterType } from "../../utils/types";

const ShareHolderDetailDetail:FC<ShareHolderDetailsListDrawerProps & {shareHolderMasterData: ShareHolderMasterType; refetchMasterData: ()=>void}> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useShareHolderDetailQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        {(data) && <Table.ScrollContainer minWidth={'100%'}>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name as Per Pan</Table.Th>
                        <Table.Td>{data.namePan}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Name as Per Aadhar</Table.Th>
                        <Table.Td>{data.nameAadhar}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Name as Per CML</Table.Th>
                        <Table.Td>{data.nameCml}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Contact Phone Number</Table.Th>
                        <Table.Td>{data.phone}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Contact Email address</Table.Th>
                        <Table.Td>{data.email}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Aadhaar Number (if applicable)</Table.Th>
                        <Table.Td>{data.aadhar}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client PAN (Permanent Account Number)</Table.Th>
                        <Table.Td>{data.pan}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Age</Table.Th>
                        <Table.Td>{data.age}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Date of Birth (if applicable)</Table.Th>
                        <Table.Td>{dayjs(data.dob?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client nationality</Table.Th>
                        <Table.Td>{data.nationality}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Place of Birth</Table.Th>
                        <Table.Td>{data.placeOfBirth}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client City</Table.Th>
                        <Table.Td>{data.city}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client State</Table.Th>
                        <Table.Td>{data.state}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client country of birth</Table.Th>
                        <Table.Td>{data.countryOfBirth}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client DP ID</Table.Th>
                        <Table.Td>{data.DPID}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client name as per Bank account</Table.Th>
                        <Table.Td>{data.nameBank}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank name</Table.Th>
                        <Table.Td>{data.bankName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank address</Table.Th>
                        <Table.Td>{data.addressBank}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank Email</Table.Th>
                        <Table.Td>{data.bankEmail}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank Phone number</Table.Th>
                        <Table.Td>{data.bankPhone}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank account MICR code</Table.Th>
                        <Table.Td>{data.bankMICR}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank account IFS code</Table.Th>
                        <Table.Td>{data.bankIFS}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank Account Number</Table.Th>
                        <Table.Td>{data.bankAccountNo}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank account type</Table.Th>
                        <Table.Td>{data.bankAccountType}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client address as per Bank</Table.Th>
                        <Table.Td>{data.addressBank}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Email ID as per Bank</Table.Th>
                        <Table.Td>{data.emailBank}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Phone number as per Bank</Table.Th>
                        <Table.Td>{data.phoneBank}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client address PIN code</Table.Th>
                        <Table.Td>{data.pincodeBank}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Demat Account No.</Table.Th>
                        <Table.Td>{data.dematAccountNo}</Table.Td>
                    </Table.Tr>
                    {props.shareHolderMasterData.caseType.includes("ClaimSuspense") && <>
                        <Table.Tr>
                            <Table.Th colSpan={2}><Title order={5} style={{textAlign: 'center'}}>Claim / Suspense</Title></Table.Th>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Share Holder Name</Table.Th>
                            <Table.Td>{data.shareholderName}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Share Holder Name as per Certificate</Table.Th>
                            <Table.Td>{data.shareholderNameCertificate}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Share Holder Name as per PAN</Table.Th>
                            <Table.Td>{data.shareholderNamePan}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Share Holder Name as per Aadhaar</Table.Th>
                            <Table.Td>{data.shareholderNameAadhar}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Share Holder Name as per CML</Table.Th>
                            <Table.Td>{data.shareholderNameCml}</Table.Td>
                        </Table.Tr>
                    </>}
                    {props.shareHolderMasterData.caseType.includes("Transmission") && <>
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
                                <Table.Td>{data.document}</Table.Td>
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
                            <Table.Td>{data.selectClaimant}</Table.Td>
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
                </Table.Thead>
            </Table>
        </Table.ScrollContainer>}
    </ErrorBoundary>
  );
}

export default ShareHolderDetailDetail