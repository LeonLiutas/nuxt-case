export default cachedEventHandler(async (event) => {
    // get API URL from config
    const { apiUrl } = useRuntimeConfig()

    // Do the actual API call
    const { offers } = await $fetch<{ offers: object[] }>(apiUrl);

    return offers;
}, {
    maxAge: 300,
    swr: true,
})