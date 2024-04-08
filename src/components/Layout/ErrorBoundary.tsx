import { Alert, Box, Button, Center, LoadingOverlay, Pagination, Text } from "@mantine/core";
import { FC, ReactNode } from "react";
import { ChildrenType } from "../../utils/types";
import { AxiosError } from "axios";
import { IconInfoCircle, IconRotateClockwise } from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";
import { QueryTotalCount } from "../../utils/constant";

type ErrorBoundaryPaginationType = {
    hasPagination: boolean;
    current_page?: number;
    last_page?: number;
}
type ErrorBoundaryProps = ErrorBoundaryPaginationType & {
    isLoading: boolean;
    hasData: boolean;
    refetch: () => void;
    status: "error" | "success" | "pending";
    error: Error|AxiosError|unknown;
} & ChildrenType

const ErrorBoundaryContainer:FC<{isLoading: boolean; children: ReactNode}> = ({children, isLoading}) => {
    return (
        <Box pos="relative" bg="transparent">
            <LoadingOverlay visible={isLoading} zIndex={30} overlayProps={{ radius: "sm", blur: 2 }} />
            {children}
        </Box>
    )
}

const ErrorBoundary:FC<ErrorBoundaryProps> = ({isLoading, status, children, error, hasPagination, hasData, refetch, ...props}) => {
    const [searchParams, setSearchParams] = useSearchParams();

    if(error){
        const errorMessage = status==="error" ? (error instanceof AxiosError ? error.response?.data?.message : (error instanceof Error ?  error.message : "Something went wrong! Please try again.")) : null;
        return (
            <ErrorBoundaryContainer isLoading={isLoading}>
                <Alert variant="light" color="red" title={errorMessage} icon={<IconInfoCircle />}>
                    <Button color="red" rightSection={<IconRotateClockwise size={14} />} onClick={refetch}>Refresh</Button>
                </Alert>
            </ErrorBoundaryContainer>
        )
    }
    if(status==="success" && hasData){
        return (
            <ErrorBoundaryContainer isLoading={isLoading}>
                {children}
                {hasPagination && <Center mt="md" pb="sm">
                    <Pagination value={hasPagination ? props.current_page : 10} total={props.last_page || 10} onChange={(page) => setSearchParams(page ? {page: page.toString(), limit: searchParams.get('limit') || QueryTotalCount.toString(), search: searchParams.get('search') || ''} : {})} />
                </Center>}
            </ErrorBoundaryContainer>
        )   
    }
    return (
        <ErrorBoundaryContainer isLoading={isLoading}>
            <Center mt="md" pb="sm" pt="sm">
                <Text>No data found</Text>
            </Center>
        </ErrorBoundaryContainer>
    )
}

export default ErrorBoundary;