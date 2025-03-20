import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {User} from './user.entity';

@Entity('habits')
export class Habit {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, user => user.id, {onDelete: 'CASCADE'})
    user: User;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    duration: number;

    @Column()
    frequency: number;

    @Column({ type: 'enum', enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' })
    priority: 'LOW' | 'MEDIUM' | 'HIGH';

    @Column()
    createdAt: Date;
}