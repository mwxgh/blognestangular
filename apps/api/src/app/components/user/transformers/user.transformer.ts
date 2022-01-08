/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transformer } from '../../../shared/transformers/transformer';
import { RoleTransformer } from '../../auth/transformers/role.transformer';

import { User } from '../entities/user.entity';

export class UserTransformer extends Transformer {
  transform(model: User): any {
    return {
      id: model.id,
      email: model.email,
      username: model.username,
      firstName: model.firstName,
      lastName: model.lastName,
      status: model.status,
      code: model.code,
      verified: model.verified,
      verifiedAt: model.verifiedAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
  includeRoles(model: User): any {
    return this.collection(model.roles, new RoleTransformer());
  }
}
