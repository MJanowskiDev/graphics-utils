import { Role } from '../../core/enums/role.enum';

export class UserTokenPayloadDto {
  id: string;
  tokenId: string;
  role: Role | null;
}
