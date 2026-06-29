export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: TableRecord;
      profiles: TableRecord;
      posts: TableRecord;
      categories: TableRecord;
      post_images: TableRecord;
      videos: TableRecord;
      companies: TableRecord;
      dre_entries: TableRecord;
      cashflow_entries: TableRecord;
      indicators: TableRecord;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

type TableRecord = {
  Row: Record<string, Json>;
  Insert: Record<string, Json | undefined>;
  Update: Record<string, Json | undefined>;
  Relationships: [];
};
