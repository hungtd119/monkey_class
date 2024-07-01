import React from "react";
import { Button } from "react-bootstrap";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  backgroundColor: string;
  color: string;
}

const CustomButton: React.FC<ButtonProps> = ({
  backgroundColor,
  color,
  children,
  ...restProps
}) => {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: backgroundColor,
    color: color
  };

  return (
    <Button style={buttonStyle} {...restProps}>
      {children}
    </Button>
  );
};

export default CustomButton;
