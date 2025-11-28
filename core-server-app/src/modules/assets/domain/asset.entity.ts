import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string; // Имя файла на диске (хеш)

  @Column()
  originalName: string; // Оригинальное название

  @Column()
  mimeType: string; // image/jpeg и т.д.

  @Column('int')
  size: number;

  @Column()
  path: string; // Относительный путь или URL

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
