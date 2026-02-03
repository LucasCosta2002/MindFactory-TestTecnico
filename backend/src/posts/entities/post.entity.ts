import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, RelationId, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Like } from './like.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 120 })
    title: string;

    @Column('text', { nullable: true })
    content: string | null;

    @Column('simple-array', { nullable: true })
    images: string[] | null;

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @RelationId((post: Post) => post.user)
    userId: string;

    @OneToMany(() => Like, (like) => like.post)
    likes: Like[];

    @CreateDateColumn({ type: 'timestamptz', precision: 3 })
    createdAt: Date;
}