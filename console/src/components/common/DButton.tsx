import React, {ReactNode} from "react";
import {Button, ButtonProps} from "@/components/ui/button.tsx";

interface DButtonProps {
  icon?: ReactNode;
  text?: ReactNode;
  children?: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  onClick?: () => void;
}

export const DButton: React.FC<DButtonProps & ButtonProps> = (props) => {
  return (
      <Button variant={props.variant} onClick={props.onClick} {...props}>
        <div className="flex items-center gap-1">
          {props.icon}
          {props.text || props.children}
        </div>
      </Button>
  );
};