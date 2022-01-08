/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as _ from 'lodash';

export class Transformer {
  public includes: any[];
  constructor(includes?: any[]) {
    this.includes = includes;
  }

  item(obj, transformer) {
    if (_.isNil(obj)) {
      return null;
    }
    return { data: transformer.get(obj) };
  }

  collection(collection, transformer) {
    if (!_.isArray(collection)) {
      return [];
    }
    const data = _.map(collection, i => {
      return transformer.get(i);
    });
    return { data: data };
  }

  get(model) {
    const data = (this as any).transform(model);
    if (Array.isArray(this.includes) && this.includes.length > 0) {
      _.forEach(this.includes, include => {
        const f = _.camelCase(`include_${include}`);
        if (!_.isFunction(this[f])) {
          throw new Error(`${f} function is missing`);
        }
        data[include] = this[f](model);
      });
    }
    return data;
  }

  with(include) {
    this.includes.push(include);
    return this;
  }
}
