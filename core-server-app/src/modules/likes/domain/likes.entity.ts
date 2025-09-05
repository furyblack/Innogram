import { User } from 'src/modules/users/domain/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export enum LikeEntityType {
  POST = 'post',
  COMMENT = 'comment',
}

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  entity_id: number;

  @Column({ type: 'enum', enum: LikeEntityType })
  entity_type: LikeEntityType;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;
}
