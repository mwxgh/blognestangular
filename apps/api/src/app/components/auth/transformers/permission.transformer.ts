/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Transformer } from '../../../shared/transformers/transformer';
import { PermissionGroupTransformer } from './permission-group.transformer';

interface PermissionInterface {
  id: number,
  name: string,
  slug: string,
  permissionGroupId: number,
  permissionGroup?: any;
}

export class PermissionTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      permissionGroupId: model.permissionGroupId,
    };
  }
  includePermissionGroup(model: PermissionInterface): any {
    return this.item(model.permissionGroup, new PermissionGroupTransformer());
  }
}
