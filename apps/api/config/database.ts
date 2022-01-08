import { PasswordReset } from '../src/app/components/auth/entities/passwordReset.entity';
import { Role } from '../src/app/components/auth/entities/role.entity';
import { UserRole } from '../src/app/components/auth/entities/userRole.entity';
import { User } from '../src/app/components/user/entities/user.entity';
import { Permission } from '../src/app/components/auth/entities/permission.entity';
import { RolePermission } from '../src/app/components/auth/entities/rolePermission.entity';
import { PermissionGroup } from '../src/app/components/auth/entities/permissionGroup.entity';
import { environment } from '../src/environments/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (): any => ({
  type: environment.dbConnection || 'mysql',
  host: environment.dbHost,
  username: environment.dbUser,
  password: environment.dbPass,
  database: environment.dbName,
  port: parseInt(environment.dbPort),
  entities: [
    User,
    Role,
    UserRole,
    PasswordReset,
    Permission,
    RolePermission,
    PermissionGroup,
  ],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: environment.migrationsRun,
  logging: environment.dbLog === true,
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'database/migrations',
  },
});
