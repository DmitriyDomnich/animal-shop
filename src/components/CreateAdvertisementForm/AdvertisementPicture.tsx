import React, { useCallback, useMemo, useState } from 'react';

type Props = {
  className?: string;
  children?: JSX.Element;
  render?: () => JSX.Element;
  imgSrc?: string;
};

const styles = {
  defaultCardStyles:
    'first:mt-2 first:ml-2 cursor-pointer bg-gray-300 dark:bg-gray-800 h-44 w-56 rounded-md flex justify-center items-center',
};

const AdvertisementPicture: React.FC<Props> = ({
  className,
  children,
  render,
  imgSrc,
}: Props) => {
  const [isHovering, setIsHovering] = useState(false);

  const onMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, [setIsHovering]);
  const onMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, [setIsHovering]);
  const style = useMemo(
    () =>
      imgSrc
        ? {
            backgroundImage: `url(${imgSrc})`,
          }
        : {},
    [imgSrc]
  );

  return (
    <div
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={styles.defaultCardStyles + className}
    >
      {children}
      {render && isHovering && render()}
    </div>
  );
};

export default AdvertisementPicture;
