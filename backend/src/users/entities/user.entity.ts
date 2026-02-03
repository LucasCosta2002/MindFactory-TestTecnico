import { Post } from 'src/posts/entities/post.entity';
import { Like } from 'src/posts/entities/like.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {length: 60})
    name: string;

    @Column('varchar', {length: 60})
    username: string;

    @Column('varchar', {length: 60, unique: true})
    email: string;

    @Column('varchar', {length: 60})
    password: string;

    @Column('varchar', { length: 200, nullable: true })
    bio: string | null;

    @Column('varchar', { length: 200, nullable: true })
    profileImage: string | null;

    @Column('boolean', { default: false })
    confirmed: boolean;

    @Column('varchar', { nullable: true })
    token: string | null;

    @OneToMany( () => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];

    @CreateDateColumn({ type: "timestamptz", precision: 3 })
    createdAt: Date;
}
