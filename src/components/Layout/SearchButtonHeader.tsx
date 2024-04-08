import { Button, Group, TextInput, rem } from "@mantine/core";
import { FC } from "react";
import { IconSearch } from "@tabler/icons-react";
import { useSearchQueryParam } from "../../hooks/useSearchQueryParam";

type SearchButtonHeaderProps = {
    hasButton: false;
    hasSearch?: boolean;
} | {
    hasButton: true;
    hasSearch?: boolean;
    buttonClickHandler: () => void;
    buttonText: string;
}

const SearchButtonHeader:FC<SearchButtonHeaderProps> = ({hasSearch=true, ...props}) => {
    const icon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;
    const {searchHandler} = useSearchQueryParam();

    return (
        <Group justify={(!props.hasButton && hasSearch) ? "flex-end" : "space-between"} mb="lg">
            {props.hasButton && <Button type='submit' variant="filled" color='blue' onClick={props.buttonClickHandler}>
                {props.buttonText}
            </Button>}
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