import { Chip } from '@mui/material';
import React, { useCallback } from 'react';
import { AdvertisementFormStateModel } from '.';

type Props = {
  deletable?: boolean;
  tags: string[];
  onDeleteTag?: React.Dispatch<
    React.SetStateAction<AdvertisementFormStateModel>
  >;
  size?: 'medium' | 'small';
};

const AdvTags = ({
  deletable = false,
  tags,
  onDeleteTag,
  size = 'medium',
}: Props) => {
  const handleDelete = useCallback(
    (chipToDelete: string) => {
      onDeleteTag!((prev) => ({
        ...prev,
        tags: {
          isTouched: true,
          value: prev.tags.value.filter((tag) => tag !== chipToDelete),
        },
      }));
    },
    [onDeleteTag]
  );

  return (
    <>
      {tags.map((tag) => (
        <Chip
          key={tag}
          size={size}
          label={tag}
          className='first:ml-2 first:mt-2'
          onDelete={deletable ? handleDelete.bind(null, tag) : undefined}
        />
      ))}
    </>
  );
};

export default AdvTags;
