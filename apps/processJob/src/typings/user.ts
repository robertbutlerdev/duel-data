export interface IUser {
  user_id: string | null;
  name: string;
  email: string;
  instagram_handle: string | null;
  tiktok_handle: string;
  joined_at: string | null;
  advocacy_programs: {
    program_id: string | null;
    brand: string | null;
    tasks_completed: {
      task_id: string | null;
      platform: string | null;
      post_url: string;
      likes: number | null;
      comments: number | null;
      shares: number;
      reach: number;
    }[];
    total_sales_attributed: number;
  }[];
}
