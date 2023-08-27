export type ButtonProps = {
  label?: string;
  size?: Size;
  variant?: Variant;
  outlined?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

export enum Size {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

export enum Variant {
  primary = 'primary',
  secondary = 'secondary',
}
