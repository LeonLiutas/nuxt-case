export default cachedEventHandler(async (event) => {    
    const { apiUrl } = useRuntimeConfig()

    const { offers: response } = await $fetch<{ offers: object[] }>(apiUrl);

    const meta = {
        timestamp: new Date().toISOString(),
        total: response.length
    }

    return {
        meta,
        vacancies: response,
    }
}, {
    maxAge: 60,
    swr: true,
})