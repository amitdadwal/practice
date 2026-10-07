import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  ComponentType,
} from "react";

type ComponentProps = {
  onReady: (element: HTMLInputElement) => void;
}
interface Props {
  component: ComponentType<ComponentProps>;
}

export type CountdownHandle = {
  focus: () => void;
};

const StripeInput = forwardRef<CountdownHandle, Props>(
  ({ component: Component, ...other }, ref) => {
    const elementRef = useRef<HTMLDivElement| null>(null);
    useImperativeHandle(ref, () => ({
      focus: () => elementRef?.current?.focus,
    }));

    return (
      <Component
        onReady={(element) => (elementRef.current = element)}
        {...other}
      />
    );
  }
);

export default StripeInput;

StripeInput.displayName = "StripeInput";
