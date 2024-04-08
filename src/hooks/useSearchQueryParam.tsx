import debounce from 'lodash.debounce';
import { useSearchParams } from 'react-router-dom';
import { QueryInitialPageParam, QueryTotalCount } from '../utils/constant';
import { DebouncedFunc } from 'lodash';

/*
  * Toast Hook Type
*/
type SearchQueryParamHookType = () => {
    searchHandler:  DebouncedFunc<(value: string) => void>;
}


/*
  Toast Hook Function: This hook is used to have common toast configs at one place
*/
export const useSearchQueryParam:SearchQueryParamHookType = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const searchHandler = debounce((value: string) => setSearchParams({page: searchParams.get('page') || QueryInitialPageParam.toString(), limit: searchParams.get('limit') || QueryTotalCount.toString(), search: value}), 500)

    return {
        searchHandler
    };
}