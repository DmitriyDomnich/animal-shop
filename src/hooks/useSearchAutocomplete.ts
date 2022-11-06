import { useEffect, useState } from 'react';
import Fire from 'services/fire';

type OptionsState = {
  loading: boolean;
  error: null | any;
  data: string[];
};

export const useSearchAutocomplete = (
  term: string | null
): [string[], boolean, any | null] => {
  const [options, setOptions] = useState<OptionsState>({
    data: [],
    error: null,
    loading: false,
  });

  useEffect(() => {
    if (term) {
      setOptions((prev) => ({ ...prev, data: [], loading: true }));
      Fire.getTagsByTerm(term).then((response) => {
        if (response.success) {
          setOptions({
            data: response.data!.map(
              (tagLowerCase) =>
                `${tagLowerCase[0].toUpperCase()}${tagLowerCase.slice(1)}`
            ),
            error: null,
            loading: false,
          });
        } else {
          setOptions((prev) => ({
            ...prev,
            error: response.error,
            loading: false,
          }));
        }
      });
    } else {
      setOptions((prev) => ({ ...prev, data: [], loading: false }));
    }
  }, [term]);

  return [options.data, options.loading, options.error];
};
