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
import { Places } from 'locales/models';
import { AdvertisementModel, PictureModel } from 'models/AdvertisimentModel';
import { AnimalTypeModel } from 'models/AnimalTypeModel';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppDispatch, useAppSelector } from 'rdx/hooks';
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import AdvTags from './AdvTags';
import { encodeImageToBlurhash } from 'utils/blurhashEncode';

type Props = {
  advertisement?: AdvertisementModel;
};

export type AdvertisementFormStateModel = {
  name: {
    value: string;
    isTouched: boolean;
  };
  type: string;
  price: {
    value: number;
    isTouched: boolean;
  };
  pictures: {
    value: (PictureModel | null)[];
    isTouched: boolean;
  };
  tags: { value: string[]; isTouched: true };
  description: string;
  place: {
    isTouched: boolean;
    value: Places | '';
  };
  userName: {
    isTouched: boolean;
    value: string;
  };
  phoneNumber: {
    isTouched: boolean;
    value: string;
  };
};

const CreateAdvertisementForm = ({ advertisement }: Props) => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const [animalTypes] = useAnimalTypes();
  const dispatch = useAppDispatch();
  const [places] = usePlaces();
  const [, advLoading] = useAppSelector(selectUserAdvertisements);
  const [user] = useAppAuth();
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const advertisementId = useMemo(
    () => advertisement?.id || createId(),
    [advertisement]
  );

  const tagsInputRef = useRef<HTMLInputElement>(null);

  const [formState, setFormState] = useState<AdvertisementFormStateModel>({
    name: advertisement
      ? { value: advertisement.name, isTouched: true }
      : { value: '', isTouched: false },
    type: advertisement ? advertisement.type : 'Dog',
    price: advertisement
      ? { value: advertisement.price, isTouched: true }
      : {
          value: 100,
          isTouched: false,
        },
    pictures: advertisement
      ? { value: advertisement.pictures, isTouched: true }
      : {
          value: Array.from<null | PictureModel>({ length: 8 }).fill(null),
          isTouched: false,
        },
    tags: advertisement
      ? { value: advertisement.tags || [], isTouched: true }
      : { value: [], isTouched: true },
    description: advertisement ? advertisement.description : '',
    place: advertisement
      ? { value: advertisement.place, isTouched: true }
      : { value: '', isTouched: false },
    userName: advertisement
      ? { value: advertisement.userName, isTouched: true }
      : { value: '', isTouched: false },
    phoneNumber: advertisement
      ? { value: advertisement.phoneNumber, isTouched: true }
      : {
          value: '',
          isTouched: false,
        },
  });

  const handleFormValueChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      const name = target.name as keyof AdvertisementFormStateModel;
      const value = target.value;

      setFormState((prev) => ({
        ...prev,
        [name]:
          typeof prev[name] === 'object'
            ? {
                ...(prev[name] as any),
                value,
              }
            : value,
      }));
    },
    [setFormState]
  );
  const handleFormValueBlur = useCallback(
    ({ target }: any) => {
      const name = target.name as keyof AdvertisementFormStateModel;

      setFormState((prev) => ({
        ...prev,
        [name]: {
          ...(prev[name] as any),
          isTouched: true,
        },
      }));
    },
    [setFormState]
  );

  const onPlaceSelected = useCallback(
    (value: Places | '') => {
      setFormState((prev) => ({
        ...prev,
        place: {
          isTouched: true,
          value,
        },
      }));
    },
    [setFormState]
  );
  const handleTagAdd = useCallback(() => {
    const newTag = tagsInputRef.current!.value;

    if (newTag && !formState.tags.value.find((currTag) => currTag === newTag)) {
      setFormState((prev) => ({
        ...prev,
        tags: { value: prev.tags.value.concat(newTag), isTouched: true },
      }));
      tagsInputRef.current!.value = '';
    }
  }, [setFormState, tagsInputRef, formState]);

  const handleSubmit = useCallback(
    async (ev: FormEvent) => {
      ev.preventDefault();
      const potentialNotValidated = Object.values(formState).filter(
        (val) => typeof val === 'object'
      );

      if (
        Object.values(potentialNotValidated).find(
          (value) => !(value as any).isTouched
        )
      ) {
        setFormError("You didn't pass validation.");
        return;
      }
      const advToPost: AdvertisementModel = Object.entries(formState).reduce(
        (acc, [key, val]) => {
          if (typeof val === 'string') {
            acc[key] = val;
          } else if (typeof val === 'object') {
            acc[key] = val.value;
          }
          return acc;
        },
        {} as any
      );
      advToPost.id = advertisementId;
      advToPost.blurhash = await encodeImageToBlurhash(
        formState.pictures.value[0]!.url
      );
      if (advertisement) {
        dispatch(updateAdvertisement(advToPost)).then((_) => navigate('/'));
      } else {
        dispatch(postAdvertisement(advToPost)).then((_) => navigate('/'));
      }
    },
    [formState, advertisementId, dispatch, advertisement, navigate]
  );
  const handleDelete = useCallback(() => {
    dispatch(deleteAdvertisement(advertisementId)).then((_) => navigate('/'));
  }, [dispatch, advertisementId, navigate]);

  useEffect(() => {
    setFormError('');
  }, [formState, setFormError]);

  return (
    <form className='container' onSubmit={handleSubmit}>
      <div className='bg-indigo-300 dark:bg-gray-700 p-4'>
        <h4 className='text-2xl text-sky-900 dark:text-sky-300'>
          {dictionary.describeInDetail}
        </h4>
        <h5 className='text-md text-sky-900 dark:text-sky-300 mt-3 mb-2'>
          {dictionary.enterName}*
        </h5>
        <Tooltip title='Add' placement='right'>
          <TextField
            required
            name='name'
            error={formState.name.value.length < 10 && formState.name.isTouched}
            helperText={
              formState.name.value.length < 10 && formState.name.isTouched
                ? 'Wrong input'
                : ''
            }
            value={formState.name.value}
            onChange={handleFormValueChange}
            onBlur={handleFormValueBlur}
            variant='filled'
            className='w-full md:w-2/3 lg:w-1/2'
          />
        </Tooltip>
        <h5 className='text-md text-sky-900 dark:text-sky-300 mt-3 mb-2'>
          {dictionary.category}*
        </h5>
        {animalTypes && (
          <div>
            <Select
              name='type'
              className='min-w-[120px]'
              value={formState.type}
              onChange={(ev) => handleFormValueChange(ev as any)}
            >
              {(animalTypes as AnimalTypeModel[]).map((animalType) => (
                <MenuItem key={animalType.id} value={animalType.name}>
                  {dictionary.AnimalType[animalType.name]}
                </MenuItem>
              ))}
            </Select>
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
        <PicturesPicker
          advertisementId={advertisementId}
          pictures={formState.pictures.value}
          onSetPictures={setFormState}
        />
        {formState.pictures.isTouched &&
          !formState.pictures.value.reduce(
            (acc, curr) => (curr ? acc + 1 : acc),
            0
          ) && <div className='text-red-600 text-sm ml-2'>Wrong input</div>}
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
                name='description'
                required
                value={formState.description}
                onChange={handleFormValueChange}
                variant='filled'
                fullWidth
                multiline
                rows={10}
                inputProps={{ maxLength: 1000, minLength: 50 }}
              />
            </Tooltip>
            <h5
              className={`flex justify-between text-md text-gray-500 dark:text-gray-400 mt-5 ${
                formState.description.length < 50 ? 'flex-row-reverse' : ''
              }`}
            >
              <span>
                {formState.description.length < 50
                  ? `${dictionary.writeMore} ${
                      50 - formState.description.length
                    } ${dictionary.symbols[1]}`
                  : ''}
              </span>
              <span className='text-end'>
                {formState.description.length}/1000
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
            {formState.tags.value.length ? (
              <div className='flex flex-wrap space-x-2 space-y-2 bg-[#7ca6db] dark:bg-neutral-800 shadow-lg p-3 pb-5'>
                <AdvTags
                  deletable
                  onDeleteTag={setFormState}
                  tags={formState.tags.value}
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
              onChange={(_, val) => onPlaceSelected(val?.name || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  name='place'
                  error={formState.place.isTouched && !formState.place.value}
                  helperText={
                    formState.place.isTouched && !formState.place.value
                      ? 'Wrong input'
                      : ''
                  }
                  value={formState.place.value}
                  onBlur={handleFormValueBlur}
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
            required
            name='price'
            type='number'
            error={formState.price.value < 0 && formState.price.isTouched}
            helperText={
              formState.price.value < 0 && formState.price.isTouched
                ? 'Wrong input'
                : ''
            }
            InputProps={{
              endAdornment: <InputAdornment position='end'>UAH</InputAdornment>,
            }}
            inputProps={{ min: 0 }}
            value={formState.price.value}
            onChange={handleFormValueChange}
            onBlur={handleFormValueBlur}
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
              name='userName'
              required
              error={
                formState.userName.isTouched &&
                formState.userName.value.length < 3
              }
              inputProps={{ minLength: 3 }}
              helperText={
                formState.userName.isTouched &&
                formState.userName.value.length < 3
                  ? 'Wrong input'
                  : ''
              }
              value={formState.userName.value}
              onBlur={handleFormValueBlur}
              onChange={handleFormValueChange}
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
              name='phoneNumber'
              type='tel'
              required
              error={
                formState.phoneNumber.isTouched &&
                formState.phoneNumber.value.length < 9
              }
              inputProps={{ minLength: 9 }}
              helperText={
                formState.phoneNumber.isTouched &&
                formState.phoneNumber.value.length < 9
                  ? 'Wrong input'
                  : ''
              }
              value={formState.phoneNumber.value}
              onChange={handleFormValueChange}
              onBlur={handleFormValueBlur}
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
        {formError && <div className='text-lg text-red-600'>{formError}</div>}
      </div>
    </form>
  );
};

export default CreateAdvertisementForm;
