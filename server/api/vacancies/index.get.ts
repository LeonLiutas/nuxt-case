import type { Vacancy } from '~/types';
import { VacancyLevel } from '~/types';

export default eventHandler(async (event) => {
    // Get the raw vacancies from the external API
    const response : Array<object> = await $fetch('/api/vacancies/raw');

    // get query parameters
    const query = getQuery(event);

    // Get filtered options for locations
    const filteredLocations = (
        Array.isArray(query.locations) ? query.locations : [query.locations || '']
    ).filter(Boolean); // Filter out empty strings or undefined values

    // Filtered options for departments
    const filteredDepartments = (
        Array.isArray(query.departments) ? query.departments : [query.departments || '']
    ).filter(Boolean); // Filter out empty strings or undefined values

    // Get search query
    const searchQuery = query.search ? String(query.search).toLowerCase() : ''

    // Min/max hours filter
    const filteredMinHours = Number(query.minHours || 0);

    const filteredSalary = {
        min: Number(query.minSalary || 0),
        max: Number(query.maxSalary || Infinity),
    }

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

    const filteredVacancies = vacancies
        // filter vacancies by locations if provided
        .filter((vacancy) => {
            if(filteredLocations.length === 0) return true;

            return filteredLocations.includes(vacancy.location.toLowerCase());
        })
        // filter vacancies by departments if provided
        .filter((vacancy) => {
            if(filteredDepartments.length === 0) return true;

            return filteredDepartments.includes(vacancy.department.toLowerCase());
        })
        // filter vacancies by search query
        .filter((vacancy) => {
            if(searchQuery.length === 0) return true;

            return vacancy.title.toLowerCase().includes(searchQuery);
        })
        // filter vacancies by hours
        .filter((vacancy) => {
            // If no min hours filter is active, return all vacancies
            if(!filteredMinHours) return true;

            // If vacancy has no min/max hours, always return
            if(!vacancy.min_hours && !vacancy.max_hours) return true; 

            return vacancy.min_hours <= filteredMinHours && filteredMinHours <= vacancy.max_hours;
        })
        // filter vacancies by salary
        .filter((vacancy) => {
            // If no salary filter is active, return all vacancies
            if(!filteredSalary.min && (!filteredSalary.max || filteredSalary.max === Infinity)) return true;

            // If vacancy has no salary, do not show
            if(!vacancy.salary_min && !vacancy.salary_max) return false;

            const minSalary = Number(vacancy.salary_min || 0);
            const maxSalary = Number(vacancy.salary_max || Infinity);

            return minSalary <= filteredSalary.max && minSalary > filteredSalary.min && maxSalary >= filteredSalary.min;
        });


    // Create sets of unique filterable items 
    // Create a list of unique locations, filter empty strings, and sort them ascending
    const allLocations = [...new Set(vacancies.map(v => v.location) || [])]
        .filter(Boolean)
        .sort();

    // Create a list of unique departments, filter empty strings, and sort them ascending
    const allDepartments = [...new Set(vacancies.map(v => v.department) || [])]
        .filter(Boolean)
        .sort();

    // Get minimum and maximum hours per week
    const minHours = Math.min(...vacancies.map(v => v.min_hours));
    const maxHours = Math.max(...vacancies.map(v => v.max_hours));

    // Get minimum and maximum salary
    const minSalary = Math.min(...vacancies.map(v => Number(v.salary_min)))
    const maxSalary = Math.max(...vacancies.map(v => Number(v.salary_max)));

    // Create a filters object to return with the response
    const filters = {
        locations: allLocations,
        departments: allDepartments,
        hours: {
            min: minHours,
            max: maxHours,
        },
        salary: {
            min: minSalary,
            max: maxSalary,
        }
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