export interface Vacancy {
    title: string;
    location: string;
    experience: string;
    url: string;
    min_hours: number | string;
    max_hours: number | string;
    salary_min: number | string;
    salary_max: number | string;
    department: string;
    position: number;
    status?: "draft" | "internal" | "published" | "closed" | "archived"; // according to Recruitee API docs
}