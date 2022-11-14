import React, { useCallback, useMemo } from 'react';
import {
  Autocomplete,
  Button,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { useAnimalTypes } from 'hooks/useAnimalTypes';
import { FormErrorType, Places } from 'locales/models';
import { AdvertisementModel, PictureModel } from 'models/AdvertisimentModel';
import { AnimalTypeModel } from 'models/AnimalTypeModel';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppDispatch, useAppSelector } from 'rdx/hooks';
import PicturesPicker from './PicturesPicker';
import { v4 as createId } from 'uuid';
import { useAppAuth } from 'hooks/useAppAuth';
import {
  deleteAdvertisement,
  postAdvertisement,
  updateAdvertisement,
} from 'rdx/advertisements/thunks';
import { selectUserAdvertisements } from 'rdx/advertisements/selectors';
import { useNavigate } from 'react-router-dom';
import { usePlaces } from 'hooks/usePlaces';
import { useRef } from 'react';
import AdvTags from '../AdvTags';
import { encodeImageToBlurhash } from 'utils/blurhashEncode';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import Fire from 'services/fire';
import { countPhotos } from 'utils/forms';

type Props = {
  advertisement?: AdvertisementModel;
};

export type AdvertisementFormStateModel = {
  name: string;
  type: string;
  price: number;
  pictures: (PictureModel | null)[];
  tags: string[];
  description: string;
  place: Places | '';
  userName: string;
  phoneNumber: string;
};

const CreateAdvertisementForm = ({ advertisement }: Props) => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const [animalTypes] = useAnimalTypes();
  const dispatch = useAppDispatch();
  const [places] = usePlaces();
  const [, advLoading] = useAppSelector(selectUserAdvertisements);
  const [user] = useAppAuth();
  const navigate = useNavigate();

  const advertisementId = useMemo(
    () => advertisement?.id || createId(),
    [advertisement]
  );

  const tagsInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    setError,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<AdvertisementFormStateModel>({
    mode: 'onBlur',
    defaultValues: advertisement
      ? {
          name: advertisement.name,
          pictures: advertisement.pictures,
          description: advertisement.description,
          phoneNumber: advertisement.phoneNumber,
          place: advertisement.place,
          price: advertisement.price,
          tags: advertisement.tags,
          type: advertisement.type,
          userName: advertisement.userName,
        }
      : {
          name: '',
          description: '',
          phoneNumber: '',
          pictures: Array.from<null | PictureModel>({ length: 8 }).fill(null),
          place: '',
          price: 100,
          tags: [],
          type: '',
          userName: '',
        },
  });
  const { replace: setPictures } = useFieldArray<AdvertisementFormStateModel>({
    name: 'pictures',
    rules: {
      minLength: 1,
    },
    control,
  });
  const startDivRef = useRef<HTMLDivElement>(null);

  const handleTagAdd = useCallback(() => {
    const newTag = tagsInputRef.current!.value;
    const currTags = getValues('tags');
    if (newTag && !currTags.find((currTag) => currTag === newTag)) {
      setValue('tags', currTags.concat(newTag));
      tagsInputRef.current!.value = '';
    }
  }, [getValues, setValue]);

  const onSubmit: SubmitHandler<AdvertisementFormStateModel> = useCallback(
    async (data) => {
      if (!countPhotos(data.pictures)) {
        setError('pictures', {
          message: 'minPhotoLength',
        });
        startDivRef.current?.scrollIntoView();
        return;
      }

      const advToPost: AdvertisementModel = Object.entries(data).reduce(
        (acc, [key, val]) => {
          if (key === 'place') {
            acc[key] = Object.keys(dictionary.places).find(
              (key) => dictionary.places[key as Places] === val
            );
          } else {
            acc[key] = val;
          }
          return acc;
        },
        {} as any
      );
      advToPost.id = advertisementId;
      advToPost.blurhash = await encodeImageToBlurhash(data.pictures[0]!.url);
      if (advertisement) {
        dispatch(updateAdvertisement(advToPost)).then((_) => navigate('/'));
      } else {
        await Fire.addUserNameIfNotPresent(data.userName);
        dispatch(postAdvertisement(advToPost)).then((_) => navigate('/'));
      }
    },
    [
      advertisement,
      advertisementId,
      dictionary.places,
      dispatch,
      navigate,
      setError,
    ]
  );
  const handleDelete = useCallback(() => {
    dispatch(deleteAdvertisement(advertisementId)).then((_) => navigate('/'));
  }, [dispatch, advertisementId, navigate]);

  return (
    <form className='container' onSubmit={handleSubmit(onSubmit)}>
      <div className='bg-indigo-300 dark:bg-gray-700 p-4'>
        <h4 className='text-2xl text-sky-900 dark:text-sky-300'>
          {dictionary.describeInDetail}
        </h4>
        <h5 className='text-md text-sky-900 dark:text-sky-300 mt-3 mb-2'>
          {dictionary.enterName}*
        </h5>
        <Tooltip title={dictionary.titleTooltipText} placement='right'>
          <TextField
            {...register('name', {
              required: {
                value: true,
                message: 'required',
              },
              minLength: {
                message: 'minLength',
                value: 10,
              },
            })}
            helperText={
              errors.name
                ? errors.name.type === 'required'
                  ? dictionary.errors[errors.name.message as FormErrorType]
                  : errors.name.type === 'minLength'
                  ? 10 + dictionary.errors[errors.name.message as FormErrorType]
                  : ''
                : ''
            }
            error={!!errors.name}
            variant='filled'
            className='w-full md:w-2/3 lg:w-1/2'
          />
        </Tooltip>
        <h5 className='text-md text-sky-900 dark:text-sky-300 mt-3 mb-2'>
          {dictionary.category}*
        </h5>
        {animalTypes && (
          <div className='flex items-center'>
            <Controller
              name='type'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'required',
                },
              }}
              render={({ field }) => (
                <Select {...field} className='min-w-[120px]'>
                  {(animalTypes as AnimalTypeModel[]).map((animalType) => (
                    <MenuItem key={animalType.id} value={animalType.name}>
                      {dictionary.AnimalType[animalType.name]}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.type?.message && (
              <div className='text-red-600 text-sm ml-2'>
                {dictionary.errors[errors.type?.message as FormErrorType]}
              </div>
            )}
          </div>
        )}
      </div>
      <div className='mt-5 bg-indigo-300 dark:bg-gray-700 p-4'>
        <h4 className='text-2xl text-sky-900 dark:text-sky-300'>
          {dictionary.photo}
        </h4>
        <h5 className='text-md text-sky-900 dark:text-sky-300 mt-3 mb-2'>
          {dictionary.photoText}
        </h5>
        <Controller
          control={control}
          name='pictures'
          render={() => (
            <PicturesPicker
              ref={startDivRef}
              clearErrors={clearErrors}
              setError={setError}
              onSetPictures={setPictures}
              advertisementId={advertisementId}
              pictures={getValues('pictures')}
            />
          )}
        />
        {errors.pictures?.message && (
          <div className='text-red-600 text-sm ml-2'>
            {dictionary.errors[errors.pictures.message as FormErrorType]}
          </div>
        )}
      </div>
      <div className='mt-5 bg-indigo-300 dark:bg-gray-700 p-4 flex flex-wrap'>
        <div className='w-full md:w-1/2 pr-5'>
          <h5 className='text-md text-sky-900 dark:text-sky-300 mt-3 mb-2'>
            {dictionary.description}*
          </h5>
          <div className='flex flex-col w-full'>
            <Tooltip
              title='Write a description for your animal'
              placement='right'
            >
              <TextField
                {...register('description', { required: true, minLength: 50 })}
                name='description'
                variant='filled'
                fullWidth
                multiline
                rows={10}
                inputProps={{ maxLength: 1000 }}
              />
            </Tooltip>
            <h5
              className={`flex justify-between text-md text-gray-500 dark:text-gray-400 mt-5 ${
                watch('description').length < 50 ? 'flex-row-reverse' : ''
              }`}
            >
              <span>
                {watch('description').length < 50
                  ? `${dictionary.writeMore} ${
                      50 - getValues('description').length
                    } ${dictionary.symbols[1]}`
                  : ''}
              </span>
              <span className='text-end'>
                {watch('description').length}/1000
              </span>
            </h5>
          </div>
        </div>
        <div className='w-full md:w-1/2'>
          <h5 className='text-md text-sky-900 dark:text-sky-300 mt-3 mb-2'>
            {dictionary.tags}
          </h5>
          <div className='flex flex-col space-y-2'>
            <div className='flex space-x-2'>
              <TextField
                label={dictionary.enterTags}
                defaultValue=''
                size='small'
                inputRef={tagsInputRef}
                className='win-w-[300px] w-3/4'
              />
              <Button
                color='secondary'
                variant='contained'
                onClick={handleTagAdd}
              >
                {dictionary.add}
              </Button>
            </div>
            {watch('tags').length ? (
              <div className='flex flex-wrap space-x-2 space-y-2 bg-[#7ca6db] dark:bg-neutral-800 shadow-lg p-3 pb-5'>
                <AdvTags
                  deletable
                  onDeleteTag={setValue}
                  tags={watch('tags')}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className='mt-5 bg-indigo-300 dark:bg-gray-700 p-4 flex space-x-10'>
        <div>
          <h5 className='text-md text-sky-900 dark:text-sky-300 mt-3 mb-4'>
            {dictionary.location}*
          </h5>
          <Tooltip title='It will show in the advertisement' placement='right'>
            <Autocomplete
              disablePortal
              options={places}
              sx={{ width: 300 }}
              getOptionLabel={(option) =>
                dictionary.places[option.name as Places]
              }
              onChange={(_, val) => {
                console.log('setting', val?.name);

                val && setValue('place', val.name);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...register('place', {
                    required: {
                      message: 'required',
                      value: true,
                    },
                    validate: (val) => {
                      console.log('validating', val);

                      return (
                        val &&
                        !!Object.values(dictionary.places).find(
                          (place) => place === val
                        )
                      );
                    },
                  })}
                  error={!!errors.place}
                  helperText={
                    errors.place
                      ? dictionary.errors[errors.place.message as FormErrorType]
                      : ''
                  }
                  variant='standard'
                  label={dictionary.region}
                />
              )}
            />
          </Tooltip>
        </div>
        <div>
          <h5 className='text-md text-sky-900 dark:text-sky-300 mt-3 mb-4'>
            {dictionary.price}*
          </h5>
          <TextField
            {...register('price', {
              min: {
                value: 0,
                message: 'min',
              },
            })}
            type='number'
            error={!!errors.price}
            helperText={
              errors.price
                ? dictionary.errors[errors.price.message as FormErrorType]
                : ''
            }
            InputProps={{
              endAdornment: <InputAdornment position='end'>UAH</InputAdornment>,
            }}
            inputProps={{ min: 0 }}
          />
        </div>
      </div>
      <div className='mt-5 bg-indigo-300 dark:bg-gray-700 p-4'>
        <h4 className='text-2xl text-sky-900 dark:text-sky-300'>
          {dictionary.contactDetails}
        </h4>
        <div className='flex flex-wrap space-x-6 space-y-3'>
          <div className='mt-3 ml-6 w-full sm:w-1/2 md:w-1/4'>
            <h5 className='text-md text-sky-900 dark:text-sky-300 mt-3 mb-4'>
              {dictionary.yourName}*
            </h5>
            <TextField
              {...register('userName', {
                required: {
                  value: true,
                  message: 'required',
                },
                minLength: {
                  value: 3,
                  message: 'minLength',
                },
              })}
              error={!!errors.userName}
              helperText={
                errors.userName
                  ? errors.userName.type === 'minLength'
                    ? 3 +
                      dictionary.errors[
                        errors.userName.message as FormErrorType
                      ]
                    : errors.userName.type === 'required'
                    ? dictionary.errors[
                        errors.userName.message as FormErrorType
                      ]
                    : ''
                  : ''
              }
              fullWidth
              variant='standard'
            />
          </div>
          <div className='w-full sm:w-1/2 md:w-1/4'>
            <h5 className='text-md text-sky-900 dark:text-sky-300 mt-3 mb-4'>
              {dictionary.email}
            </h5>
            <TextField
              type='email'
              fullWidth
              variant='standard'
              defaultValue={user?.email || ''}
              disabled
            />
          </div>
          <div className='w-full sm:w-1/2 md:w-1/4'>
            <h5 className='text-md text-sky-900 dark:text-sky-300 mt-3 mb-4'>
              {dictionary.phoneNumber}*
            </h5>
            <TextField
              {...register('phoneNumber', {
                required: {
                  value: true,
                  message: 'required',
                },
                pattern: {
                  value:
                    /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im,
                  message: 'phoneNumber',
                },
              })}
              type='tel'
              error={!!errors.phoneNumber}
              helperText={
                errors.phoneNumber
                  ? errors.phoneNumber.type === 'required'
                    ? dictionary.errors[
                        errors.phoneNumber.message as FormErrorType
                      ]
                    : errors.phoneNumber.type === 'pattern'
                    ? dictionary.errors[
                        errors.phoneNumber.message as FormErrorType
                      ]
                    : ''
                  : ''
              }
              fullWidth
              variant='standard'
            />
          </div>
        </div>
      </div>
      <div className='mt-5 bg-indigo-300 dark:bg-gray-700 px-4 py-10  flex flex-row-reverse'>
        {advLoading ? (
          <CircularProgress />
        ) : (
          <div className='flex space-x-4'>
            {advertisement && (
              <Button
                onClick={handleDelete}
                type='button'
                size='large'
                color='error'
                variant='contained'
              >
                {dictionary.delete}
              </Button>
            )}
            <Button
              type='submit'
              size='large'
              color='success'
              variant='contained'
            >
              {advertisement ? dictionary.update : dictionary.post}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default CreateAdvertisementForm;
