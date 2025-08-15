import type { Vacancy } from '~/types';
import { VacancyLevel } from '~/types';

export default eventHandler(async (event) => {
    // Get the raw vacancies from the external API
    const response : Array<object> = await $fetch('/api/vacancies/raw');

    // get query parameters
    const query = getQuery(event);

    // Get filtered options
    const filteredLocations = (
        Array.isArray(query.locations) ? query.locations : [query.locations || '']
    ).filter(Boolean); // Filter out empty strings or undefined values

    // Map the response to a more usable format
    const vacancies: Vacancy[] = response
        .filter((vacancy: any) => vacancy.status === 'published') // Filter only published vacancies
        .map((vacancy: any) => ({
            title: vacancy.title || '',
            location: vacancy.state_name || '',
            experience: vacancy.experience_code ? VacancyLevel[vacancy.experience_code as keyof typeof VacancyLevel] || '' : '',
            url: vacancy.careers_url || '',
            min_hours: vacancy.min_hours || vacancy.min_hours_per_week || '',
            max_hours: vacancy.max_hours || vacancy.max_hours_per_week || '',
            salary_min: vacancy?.salary?.min || '',
            salary_max: vacancy?.salary?.max || '',
            department: vacancy.department || '',
            position: vacancy.position || 0, // position in order
        }))
        .sort((a, b) => a.position - b.position) // Order by position according to the Recruitee API

    // filter vacancies by locations if provided
    let filteredVacancies = vacancies.filter((vacancy) => {
        if(filteredLocations.length === 0) return true;

        return filteredLocations.includes(vacancy.location.toLowerCase());
    })

    // Setup some metadata for the response
    const meta = {
        timestamp: new Date().toISOString(),
        total: vacancies.length
    }

    // Create sets of unique filterable items
    const allLocations = [...new Set(vacancies.map(v => v.location) || [])]

    const filters = {
        locations: allLocations
    }

    // Return the data
    return {
        meta,
        filters,
        vacancies: filteredVacancies
    }
})