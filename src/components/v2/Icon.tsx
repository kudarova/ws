import type { ReactNode } from "react";

type IconName =
  | "arrow-up-right"
  | "arrow-down"
  | "arrow-up"
  | "menu"
  | "close"
  | "chevron-down"
  | "mail"
  | "phone"
  | "globe";

type IconProps = {
  name: IconName;
  className?: string;
};

function Icon({ name, className }: IconProps) {
  const sharedProps = {
    "aria-hidden": true,
    className,
    fill: "none",
    focusable: false,
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    vectorEffect: "non-scaling-stroke",
    viewBox: "0 0 24 24",
  };

  const paths: Record<IconName, ReactNode> = {
    "arrow-up-right": <><path d="M7 17 17 7" /><path d="M9 7h8v8" /></>,
    "arrow-down": <><path d="M12 4v15" /><path d="m6 13 6 6 6-6" /></>,
    "arrow-up": <><path d="M12 20V5" /><path d="m6 11 6-6 6 6" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    "chevron-down": <path d="m6 9 6 6 6-6" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m4 7 8 6 8-6" /></>,
    phone: <path d="M6.6 3.8 9 6.2 7.4 8.8a15.2 15.2 0 0 0 7.8 7.8l2.6-1.6 2.4 2.4-1.7 3.2c-.3.6-1 .9-1.7.8C9.1 20.2 3.8 14.9 2.6 7.2c-.1-.7.2-1.4.8-1.7l3.2-1.7Z" />,
    globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.8 12h16.4" /><path d="M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5C9.8 18.2 8.7 15.4 8.7 12S9.8 5.8 12 3.5Z" /></>,
  };

  return <svg {...sharedProps}>{paths[name]}</svg>;
}

export type { IconName };
export default Icon;
