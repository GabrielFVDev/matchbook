import type { SVGProps } from 'react';

export type SvgProps = SVGProps<SVGSVGElement>;

export type IconProps = SvgProps & { size?: number };
