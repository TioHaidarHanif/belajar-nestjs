import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({nullable: true})
  email?: string;

  @Column()
  password: string;

  @Column({nullable: true})
  currentHashedRefreshToken?: string;

  @Column({ default: 'member' })
  role: 'admin' | 'member';

}
