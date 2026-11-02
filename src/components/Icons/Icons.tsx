import type { IconProps, SvgProps } from './types';

const props = (size: number, rest: SvgProps): SvgProps => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  focusable: 'false',
  ...rest,
});

const strokeProps: SvgProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const HEART_PATH =
  'M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.9 3.8 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.5 0 5.6 3.4 4.5 6.6-1.7 4.8-9.2 9.4-9.2 9.4z';

export const IconHeart = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} fill="currentColor">
    <path d={HEART_PATH} />
  </svg>
);

export const IconHeartOutline = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps}>
    <path d={HEART_PATH} />
  </svg>
);

export const IconArrowRight = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps} strokeWidth={2.2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconArrowLeft = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps} strokeWidth={2.2}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const IconHome = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps}>
    <path d="M3 10.5 12 3l9 7.5V21h-6v-7H9v7H3z" />
  </svg>
);

export const IconPlus = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps} strokeWidth={2.2}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps} strokeWidth={2.2}>
    <path d="M6 12h12" />
  </svg>
);

export const IconUser = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

export const IconLogout = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps}>
    <path d="M15 4h4v16h-4M10 17l5-5-5-5M15 12H3" />
  </svg>
);

export const IconTrash = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps}>
    <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" />
  </svg>
);

export const IconPencil = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps} strokeWidth={2.2}>
    <path d="M4 20h4L19 9l-4-4L4 16z" />
  </svg>
);

export const IconEye = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconEyeOff = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps}>
    <path d="M3 3l18 18M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.5 4.5-1.2M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);

export const IconCheck = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps} strokeWidth={2.6}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const IconAlert = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps} strokeWidth={2.2}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5h.01" />
  </svg>
);

export const IconRefresh = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps} strokeWidth={2.2}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
  </svg>
);

export const IconChevronDown = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps} strokeWidth={2.2}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const IconBook = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5zM4 5.5v16" />
  </svg>
);

export const IconX = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} {...strokeProps} strokeWidth={2.2}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconGoogle = ({ size = 20, ...rest }: IconProps) => (
  <svg {...props(size, rest)} viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);
