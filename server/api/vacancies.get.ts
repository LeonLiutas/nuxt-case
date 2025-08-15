import type { Vacancy } from '~/types';

export default cachedEventHandler(async (event) => {    
    // get API URL from config
    const { apiUrl } = useRuntimeConfig()

    // Do the actual API call
    const { offers: response } = await $fetch<{ offers: object[] }>(apiUrl);

    // Map the response to a more usable format
    const vacancies: Vacancy[] = response
        .filter((vacancy: any) => vacancy.status === 'published') // Filter only published vacancies
        .map((vacancy: any) => ({
            title: vacancy.title || '',
            location: vacancy.state_name || '',
            experience: vacancy.experience_code || '',
            url: vacancy.careers_url || '',
            min_hours: vacancy.min_hours || vacancy.min_hours_per_week || '',
            max_hours: vacancy.max_hours || vacancy.max_hours_per_week || '',
            salary_min: vacancy?.salary?.min || '',
            salary_max: vacancy?.salary?.max || '',
            department: vacancy.department || '',
            position: vacancy.position || 0, // position in order
        }));

    // Setup some metadata for the response
    const meta = {
        timestamp: new Date().toISOString(),
        total: vacancies.length
    }

    // Order  vacancies by position from Recruitee API
    vacancies.sort((a, b) => a.position - b.position);

    // Return the data
    return {
        meta,
        vacancies,
    }
}, {
    maxAge: 5,
    swr: true,
})