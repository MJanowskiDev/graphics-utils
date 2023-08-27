import { IconType } from 'react-icons';

interface RenderIconProps {
  Icon?: IconType;
}
export const RenderIcon = ({ Icon }: RenderIconProps) => {
  console.log('Icon', Icon);
  return Icon ? <Icon /> : null;
};
