import { Pagination, PaginationItem } from '@mui/material';
import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

type Props = {
  count: number;
};

const AdvPagination = ({ count }: Props) => {
  const [searchParams] = useSearchParams();
  const page = useMemo(() => {
    const page = parseInt(searchParams.get('page') || '1');
    return page;
  }, [searchParams]);

  return (
    <div className='my-4 flex justify-center'>
      <Pagination
        count={count}
        page={page}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
            {...item}
          />
        )}
      />
    </div>
  );
};

export default AdvPagination;
