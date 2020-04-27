export default {
    state: {
        search: {
            testName: ''
        },
        pageIndex: 1,
        pageSize: 10
    },
    mutations: {
        test (state, data) {
            state = Object.assign(state, data)
        }
    }
}
