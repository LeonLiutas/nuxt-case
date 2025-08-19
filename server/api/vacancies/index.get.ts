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

    // Create a filtered list of vacancies based on the query parameters
    const filteredVacancies = vacancies
        .filter((vacancy) => {
            // Locations filter
            if(filteredLocations.length && !filteredLocations.includes(vacancy.location.toLowerCase())) return false;

            // Departments filter
            if(filteredDepartments.length && !filteredDepartments.includes(vacancy.department.toLowerCase())) return false;

            // Search filter
            if(searchQuery.length && !vacancy.title.toLowerCase().includes(searchQuery)) return false;

            // Hours filter
            if(filteredMinHours) {
                // TODO : let it work if there is only 1 of min or max set 
                // Check if the vacancy has min/max hours
                if (vacancy.min_hours && vacancy.max_hours) {
                    if(!(filteredMinHours >= vacancy.min_hours && filteredMinHours <= vacancy.max_hours)) return false;
                } else {
                    // No hours set for the vacancy, so we do not return it
                    return false;
                }
            }

            // Salary filter
            const minSalary = Number(vacancy.salary_min || 0);
            const maxSalary = Number(vacancy.salary_max || Infinity);

            // Check if at least 1 salary filter is set
            if(filteredSalary.min || (filteredSalary.max && filteredSalary.max !== Infinity)) {
                // Vacancy has no salary
                if(!vacancy.salary_min && !vacancy.salary_max) return false;

                // If only min salary is set
                if(filteredSalary.min && (!filteredSalary.max || filteredSalary.max === Infinity)) {
                    if(!(filteredSalary.min >= minSalary && maxSalary >= filteredSalary.min)) return false;
                }

                // If only max salary is set
                if(filteredSalary.max && (!filteredSalary.min || filteredSalary.min === 0)) {
                    if(!(filteredSalary.max >= minSalary)) return false;
                }

                // If both min and max salary are set
                if(filteredSalary.min && (filteredSalary.max && filteredSalary.max !== Infinity)) {
                    if(!(minSalary <= filteredSalary.max && maxSalary >= filteredSalary.min)) return false;
                }
            }

            // If no other filters are applied, return true
            return true;
        })
        // filter vacancies by salary
        // .filter((vacancy) => {
        //     const minSalary = Number(vacancy.salary_min || 0);
        //     const maxSalary = Number(vacancy.salary_max || Infinity);

        //     // If no salary filter is active, return all vacancies
        //     if(!filteredSalary.min && (!filteredSalary.max || filteredSalary.max === Infinity)) return true;

        //     // If vacancy has no salary, do not show
        //     if(!vacancy.salary_min && !vacancy.salary_max) return false;

        //     // If only min salary is set, check if the vacancy's min salary is within the range
        //     if(filteredSalary.min && (!filteredSalary.max || filteredSalary.max === Infinity)) {
        //         return filteredSalary.min >= minSalary && maxSalary >= filteredSalary.min;
        //     }

        //     // If only max salary is set, check if the vacancy's max salary is within the range
        //     if(filteredSalary.max && filteredSalary.min === 0) {
        //         return filteredSalary.max >= minSalary;
        //     }

        //     // If both min and max salary are set, check if the vacancy's salary range overlaps with the filter range
        //     if(minSalary > filteredSalary.min && filteredSalary.max > minSalary) return true;

        //     // If the vacancy's salary range overlaps with the filter range, or if min and max are the same
        //     return (
        //         minSalary <= filteredSalary.max && 
        //         maxSalary >= filteredSalary.min
        //     );
        // });


    // Pagination
    const totalFilteredVacancies = filteredVacancies.length;
    const perPage = 6; // Could be made dynamic in future
    const maxPage = Math.ceil(totalFilteredVacancies / perPage);

    const pageQuery = Number(query.page) > 0 ? Number(query.page) : 1;
    const page = Math.min(pageQuery, maxPage)

    const paginatedVacancies = filteredVacancies.slice(
        // Calculate the start and end index for pagination
        (page - 1) * perPage,
        (page * perPage)
    )

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
    const minSalary = Math.min(...vacancies.map(v => Number(v.salary_min)));
    const maxSalary = Math.max(...vacancies.map(v => Number(v.salary_max)));

    // Round the salaries to the nearest 500
    const minSalaryRounded = Math.floor(minSalary / 500) * 500;
    const maxSalaryRounded = Math.ceil(maxSalary / 500) * 500;

    // Create a filters object to return with the response
    const filters = {
        locations: allLocations,
        departments: allDepartments,
        hours: {
            min: minHours,
            max: maxHours,
        },
        salary: {
            min: minSalaryRounded,
            max: maxSalaryRounded,
        }
    }

    // Setup some metadata for the response
    const meta = {
        timestamp: new Date().toISOString(),
        total: vacancies.length,
        filteredTotal: filteredVacancies.length,
        pagination: {
            currentPage: page,
            perPage,
            maxPage
        }
    }

    // Return the data
    return {
        meta,
        filters,
        vacancies: paginatedVacancies,
    }
})