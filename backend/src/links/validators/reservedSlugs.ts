import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isNotReservedSlug', async: false })
export class IsNotReservedSlug implements ValidatorConstraintInterface {
  private readonly reservedSlugs = [
    'api',
    'users',
    'admin',
    'dashboard',
    'login',
    'logout',
    'register',
    'profile',
    'settings',
    'stats',
    'analytics',
    'docs',
    'help',
    'support',
    'about',
    'contact',
    'privacy',
    'terms',
    'sitemap',
    'robots',
    'favicon',
    'static',
    'assets',
    'images',
    'css',
    'js',
    'fonts',
    'health',
    'status',
  ];

  validate(value: string, args: ValidationArguments) {
    return !this.reservedSlugs.includes(value.toLowerCase());
  }

  defaultMessage(args: ValidationArguments) {
    return `The slug "${args.value}" is reserved and cannot be used.`;
  }
}