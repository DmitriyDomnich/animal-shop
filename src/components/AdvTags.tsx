import { Chip } from '@mui/material';
import React, { useCallback } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { AdvertisementFormStateModel } from './CreateAdvertisementForm';

type Props = {
  deletable?: boolean;
  tags: string[];
  onDeleteTag?: UseFormSetValue<AdvertisementFormStateModel>;
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
      onDeleteTag!(
        'tags',
        tags.filter((tag) => tag !== chipToDelete)
      );
    },
    [onDeleteTag, tags]
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
