import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn, RelationId, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from './post.entity';

@Entity()
@Unique(['user', 'post'])
export class Like {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @RelationId((like: Like) => like.user)
    userId: string;

    @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: Post;

    @RelationId((like: Like) => like.post)
    postId: string;

    @CreateDateColumn({ type: 'timestamptz', precision: 3 })
    createdAt: Date;
}
