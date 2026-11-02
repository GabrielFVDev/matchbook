export type ButtonVariant =
  'primary' | 'secondary' | 'white' | 'subtle' | 'danger' | 'dangerStrong';

export type ButtonSize = 'large' | 'medium';

export interface ButtonStyleProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
}
