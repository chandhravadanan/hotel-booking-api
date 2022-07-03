import { TransformFnParams } from 'class-transformer';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'isDate', async: false })
export class IsDateConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(propertyValue)) {
      return false;
    }

    const date = new Date(propertyValue);
    return (
      date.getTime() > 0 && date.toISOString().slice(0, 10) === propertyValue
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must be valid date in yyyy-mm-dd"`;
  }
}

@ValidatorConstraint({ name: 'isBefore', async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return propertyValue < args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must be before "${args.constraints[0]}"`;
  }
}

export function transformToAlias(origFieldName: string, defaultValue?: any) {
  return (param: TransformFnParams) =>
    param.obj[origFieldName] !== undefined
      ? param.obj[origFieldName]
      : defaultValue;
}

export function transformToDate() {
  return (param: TransformFnParams) => {
    return param.value ? new Date(param.value) : null;
  };
}

export function transformMongoDbId(key = '_id') {
  return (param: TransformFnParams) => {
    const value = param.obj[key];
    if (typeof value === 'string') {
      return value;
    } else if (value instanceof Types.ObjectId) {
      return value.toString();
    } else {
      return undefined;
    }
  };
}
