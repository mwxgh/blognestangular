/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, BadRequestException } from '@nestjs/common';
import { Pagination } from '../pagination';
@Injectable()
export class ApiResponseService {
  /**
   * Bind an item to a transformer and start building a response
   *
   * @param {*} Object
   * @param {*} Transformer
   *
   * @return Object
   */
  item(obj, transformer) {
    return { data: transformer.get(obj) };
  }

  /**
   * Bind a collection to a transformer and start building a response
   *
   * @param {*} collection
   * @param {*} transformer
   *
   * @return Object
   */
  collection(collection, transformer) {
    const data = collection.map(i => {
      return transformer.get(i);
    });
    return { data: data };
  }

  object(data) {
    return { data };
  }

  success() {
    return { data: { success: true } };
  }

  /**
   * Bind a paginator to a transformer and start building a response
   *
   * @param {*} LengthAwarePaginator
   * @param {*} Transformer
   *
   * @return Object
   */
  paginate(paginator, transformer) {
    if (!(paginator instanceof Pagination)) {
      throw new BadRequestException(`ApiResponse.paginate expect a Pagination instead a ${typeof paginator}`);
    }
    const items = paginator.items.map(i => {
      return transformer.get(i);
    });
    return {
      data: items,
      meta: {
        pagination: {
          total: paginator.meta.totalItems,
          per_page: paginator.meta.itemsPerPage,
          current_page: paginator.meta.currentPage,
          total_pages: paginator.meta.totalPages,
        },
      },
    };
  }
}
