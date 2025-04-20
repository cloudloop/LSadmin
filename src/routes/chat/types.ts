import type { Timestamp } from 'firebase/firestore';

export interface Message {
    id: string;
    text: string;
    timestamp: Timestamp;
    sender: string;
    participants: string[];
    status?: 'sent' | 'delivered' | 'read';
}

export interface ChatRoom {
    id: string;
    participants: string[];
    lastMessage?: Message;
    createdAt: Timestamp;
    updatedAt: Timestamp;
} 