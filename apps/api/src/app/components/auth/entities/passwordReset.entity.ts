import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'passwordReset' })
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  token: string;

  @Column({ type: 'timestamp' })
  expire: Date;

  @CreateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public updatedAt: Date;

  generatePasswordResetLink(base_url: string): string {
    const path = `auth/reset?token=${this.token}`;
    const url = new URL(path, base_url);
    return url.href;
  }

  generateExpirePasswordResetLink(base_url: string): string {
    const path = `auth/expire?token=${this.token}`;
    const url = new URL(path, base_url);
    return url.href;
  }
}
