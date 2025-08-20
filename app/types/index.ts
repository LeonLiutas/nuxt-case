export interface Vacancy {
    slug: string;
    title: string;
    description: string;
    location: string;
    city: string;
    experience: typeof VacancyLevel | string;
    url: string;
    min_hours: number;
    max_hours: number;
    salary_min: number | string;
    salary_max: number | string;
    department: string;
    position: number;
    status?: "draft" | "internal" | "published" | "closed" | "archived"; // according to Recruitee API docs
}

export const VacancyLevel = {
    'entry_level': 'Junior',
    'mid_level': 'Medior',
    'experienced': 'Senior',
    'student_college': 'Stage'
} as const