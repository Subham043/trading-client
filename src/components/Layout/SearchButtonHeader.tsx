import { Button, Group, TextInput, rem } from "@mantine/core";
import { FC } from "react";
import { IconSearch } from "@tabler/icons-react";
import { useSearchQueryParam } from "../../hooks/useSearchQueryParam";

type ExportButtonType = {
    hasExport: true;
    excelLoading?: boolean;
    exportClickHandler: () => void;
} | {
    hasExport: false;
}

type SearchButtonHeaderProps = ({
    hasButton: false;
    hasSearch?: boolean;
} | {
    hasButton: true;
    hasSearch?: boolean;
    buttonClickHandler: () => void;
    buttonText: string;
}) & ExportButtonType

const SearchButtonHeader:FC<SearchButtonHeaderProps> = ({hasSearch=true, ...props}) => {
    const icon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;
    const {searchHandler} = useSearchQueryParam();

    return (
        <Group justify={(!props.hasButton && !props.hasExport && hasSearch) ? "flex-end" : "space-between"} mb="lg">
            <Group align="center" gap={"xs"}>
                {props.hasButton && <Button type='submit' variant="filled" color='blue' onClick={props.buttonClickHandler}>
                    {props.buttonText}
                </Button>}
                {props.hasExport && <Button type='submit' variant="filled" color='violet' disabled={props.excelLoading} loading={props.excelLoading} onClick={props.exportClickHandler}>
                    Export
                </Button>}
            </Group>
            {hasSearch && <TextInput
                rightSectionPointerEvents="none"
                rightSection={icon}
                placeholder="Search"
                onChange={(event) => searchHandler(event.target.value)}
            />}
        </Group>
    )
}

export default SearchButtonHeader;