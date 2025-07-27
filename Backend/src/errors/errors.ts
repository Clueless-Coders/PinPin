import { HttpException } from '@nestjs/common';

export class KnownError extends HttpException {
  constructor(message: string) {
    super(message, 400);
    this.name = 'KnownError';
  }
}

export class KnownServerError extends HttpException {
  constructor(message: string) {
    super(message, 500);
    this.name = 'KnownError';
  }
}

export class DuplicateEntityException extends KnownError {
  constructor(fields: string[] | undefined, entityName: string) {
    if (fields == undefined) {
      super(`A ${entityName} record with unique field already exists`);
      return;
    }

    let fieldStringInsert = '';
    for (const field of fields) {
      if (fieldStringInsert.length > 0) fieldStringInsert += ', ';
      fieldStringInsert += field;
    }
    super(
      `A ${entityName} record with unique field(s) ${fieldStringInsert} already exists`,
    );
  }
}

export class DatabaseNotFoundException extends KnownError {
  /** Creates a detailed description of what caused
   * the database to not find a record. Fields and data entered must be
   * the same length.
   *
   * @param fields
   * @param dataEntered
   * @param entityName
   */
  constructor(dataEntered: Object, entityName: string) {
    super(
      `A ${entityName} record with field(s) ${JSON.stringify(dataEntered, null, 2)} could not be found`,
    );
  }
}
