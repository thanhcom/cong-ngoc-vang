export type Database = {
  public: {
    Tables: {
      bang_gia_vang: {
        Row: {
          id: number;
          loai_vang: string;
          mua_vao: number;
          ban_ra: number;
          updated_at: string; // timestamptz → string ISO
        };
        Insert: {
          id?: number;
          loai_vang: string;
          mua_vao: number;
          ban_ra: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          loai_vang?: string;
          mua_vao?: number;
          ban_ra?: number;
          updated_at?: string;
        };
      };
    };
  };
};

export interface BangGiaVang {
  id: number;
  loai_vang: string;
  mua_vao: number;
  ban_ra: number;
  updated_at: string;
}

export interface LichSuGiaVang {
  id: number;
  loai_vang: string;
  mua_vao: number;
  ban_ra: number;
  thay_doi_luc: string;
}

