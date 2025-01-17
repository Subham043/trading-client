import { AsyncPaginate } from "react-select-async-paginate";
import { CorporateMasterType, PaginationType } from "../../utils/types";
import type { GroupBase, MultiValue, OptionsOrGroups } from "react-select";
import { useCallback } from "react";
import { useAxios } from "../../hooks/useAxios";
import { api_routes } from "../../utils/api_routes";
import dayjs from "dayjs";

type OptionType = {
 value: number;
 label: string;
};

type Props = {
 folioId: number;
 value?: MultiValue<OptionType>;
 setValue: (value: MultiValue<OptionType>) => void;
};

export default function RightSelect({ folioId, value, setValue }: Props) {
 const { axios } = useAxios();
 const loadOptions = useCallback(
  async (
   search: string,
   _loadedOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>,
   additional: { page: number } | undefined
  ) => {
   const response = await axios.get<{
    data: PaginationType<{
     rights: CorporateMasterType[];
    }>;
   }>(
    api_routes.folios +
    `/list-corporate-master/${folioId}/rights?page=${additional ? additional.page : 1
    }&limit=10&search=${search}`
   );
   return {
    options: response.data.data.rights.map((right) => ({
     value: right.id,
     label: (dayjs(right.date).format('DD MMM YYYY') + ' (' + right.numerator + '/' + right.denominator + ')') || "",
    })),
    hasMore: response.data.data.current_page < response.data.data.last_page,
    additional: {
     page: response.data.data.current_page + 1,
    },
   };
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [folioId]
 );

 return (
  <div style={{ position: "relative", zIndex: 1, width: 300 }}>
   <AsyncPaginate
    value={value}
    loadOptions={loadOptions}
    isMulti
    // isDisabled={isDisabled}
    onChange={(value) => { setValue(value as MultiValue<OptionType>); }}
    additional={{
     page: 1,
    }}
    placeholder="Select Rights"
    debounceTimeout={500}
   />
  </div>
 );
}