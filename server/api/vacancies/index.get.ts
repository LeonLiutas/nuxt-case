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

    const filteredDepartments = (
        Array.isArray(query.departments) ? query.departments : [query.departments || '']
    ).filter(Boolean); // Filter out empty strings or undefined values

    const searchQuery = query.search ? String(query.search).toLowerCase() : ''

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
    const filteredVacancies = vacancies
        .filter((vacancy) => {
            if(filteredLocations.length === 0) return true;

            return filteredLocations.includes(vacancy.location.toLowerCase());
        })
        // filter vacancies by departments if provided
        .filter((vacancy) => {
            if(filteredDepartments.length === 0) return true;

            return filteredDepartments.includes(vacancy.department.toLowerCase());
        })
        .filter((vacancy) => {
            if(searchQuery.length === 0) return true;

            return vacancy.title.toLowerCase().includes(searchQuery);
        })


    // Create sets of unique filterable items 
    // Create a list of unique locations, filter empty strings, and sort them ascending
    const allLocations = [...new Set(vacancies.map(v => v.location) || [])]
        .filter(Boolean)
        .sort();

    // Create a list of unique departments, filter empty strings, and sort them ascending
    const allDepartments = [...new Set(vacancies.map(v => v.department) || [])]
        .filter(Boolean)
        .sort();

    const filters = {
        locations: allLocations,
        departments: allDepartments,
    }

    // Setup some metadata for the response
    const meta = {
        timestamp: new Date().toISOString(),
        total: vacancies.length,
        filteredTotal: filteredVacancies.length,
    }

    // Return the data
    return {
        meta,
        filters,
        vacancies: filteredVacancies
    }
})