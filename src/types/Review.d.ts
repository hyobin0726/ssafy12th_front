import type { Member } from './Member';
export interface Review {
    review_id: number;
    content: String;
    point: number;
    latitude: number;
    longitude: number;
    created_at: Date;
    image_url: string;
    order_index: number;
    title: string;
    like_count: number;
    liked: boolean;
    comment_count: number;
    member: Member;
}
