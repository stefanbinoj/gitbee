"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-yellow-500" />,
        info: <InfoIcon className="size-4 text-yellow-500" />,
        warning: <TriangleAlertIcon className="size-4 text-yellow-500" />,
        error: <OctagonXIcon className="size-4 text-red-500" />,
        loading: (
          <Loader2Icon className="size-4 animate-spin text-yellow-500" />
        ),
      }}
      toastOptions={{
        style: {
          background: "#0a0a0a",
          border: "1px solid #FBC02D",
          color: "#fff",
        },
        classNames: {
          success: "[&>svg]:text-yellow-500",
          error: "[&>svg]:text-red-500",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
