import React from "react";

export default function LoaderButton({
  isLoading,
  disabled = false,
  ...props
}) {
  return (
    <button disabled={disabled || isLoading} {...props}>
      {isLoading && <p>Loading...</p>}
      {props.children}
    </button>
  );
}
