import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  clearDebounceTimeout,
  setDebounceTimeout,
} from "@/redux/features/debounceButton/debounceButtonSlice";
import { Button } from "@/components/ui/button";

const DebouncedButton = ({
  buttonId,
  onClick,
  debounceDelay = 1000,
  children,
  ...restProps
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const debounceTimeout = useSelector(
    (state: RootState) => state.debounce[buttonId]
  );
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    setIsDisabled(true);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    onClick();

    const timeoutId = setTimeout(() => {
      dispatch(clearDebounceTimeout({ buttonId }));
      setIsDisabled(false);
    }, debounceDelay);

    dispatch(setDebounceTimeout({ buttonId, timeoutId }));
  };

  return (
    <Button disabled={isDisabled} onClick={handleClick} {...restProps}>
      {children}
    </Button>
  );
};

export default DebouncedButton;
