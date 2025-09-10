export interface Column {
  id: number;
  field: string;
  header: string;
}

export interface ActionInfo {
  action_type: string;
  id: string;
}

export interface Data<T> {
  data: T;
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
