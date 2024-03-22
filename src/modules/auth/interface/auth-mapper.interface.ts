import { AuthInterface } from './auth.interface';
import { AuthDTO } from '../dto/auth.dto';

export interface AuthMapperInterface {
  mapToAuthDTO(entity: AuthInterface): AuthDTO;
}
