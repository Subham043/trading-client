import { AsyncPaginate } from "react-select-async-paginate";
import { PaginationType, LegalHeirDetailType } from "../../utils/types";
import type { GroupBase, MultiValue, OptionsOrGroups } from "react-select";
import { useCallback } from "react";
import { useAxios } from "../../hooks/useAxios";
import { api_routes } from "../../utils/api_routes";

type OptionType = {
 value: number;
 label: string;
};

type Props = {
 projectId: number;
 value?: MultiValue<OptionType>;
 setValue: (value: MultiValue<OptionType>) => void;
};

export default function LegalHeirSelect({ projectId, value, setValue }: Props) {
 const { axios } = useAxios();
 const loadOptions = useCallback(
  async (
   search: string,
   _loadedOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>,
   additional: { page: number } | undefined
  ) => {
   const response = await axios.get<{
    data: PaginationType<{
     legalHeirDetail: LegalHeirDetailType[];
    }>;
   }>(
    api_routes.legalHeirDetails +
    `/list/${projectId}?page=${additional ? additional.page : 1
    }&limit=10&search=${search}`
   );
   return {
    options: response.data.data.legalHeirDetail.map((legalHeir) => ({
     value: legalHeir.id,
     label: legalHeir.namePan || "",
    })),
    hasMore: response.data.data.current_page < response.data.data.last_page,
    additional: {
     page: response.data.data.current_page + 1,
    },
   };
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [projectId]
 );

 return (
  <div style={{ position: "relative", zIndex: 12 }}>
   <AsyncPaginate
    value={value}
    loadOptions={loadOptions}
    isMulti={true}
    // isDisabled={isDisabled}
    onChange={(value) => { setValue(value); }}
    additional={{
     page: 1,
    }}
    debounceTimeout={500}
   />
  </div>
 );
}