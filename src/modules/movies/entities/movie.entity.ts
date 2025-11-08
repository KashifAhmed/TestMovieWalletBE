import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'int', name: 'publish_year' })
  publishYear: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string; // Stores the file path/URL of the uploaded image

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string; // Supabase user ID

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
