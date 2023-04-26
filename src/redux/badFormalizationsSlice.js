import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const badFormalizationsSlice = createApi({

    reducerPath: 'bad_formalizations',
    baseQuery: function _q(args, api, extraOptions) {
      if (_q.queryFn === undefined) {
        _q.queryFn = fetchBaseQuery({
          baseUrl: `${api.getState().backend.url}/api/exercises`,
          prepareHeaders: (headers) => {
              headers.set("Authorization", "Bearer " + localStorage.getItem("formalization_checker_token"))
              return headers;
          }})
      }
      return _q.queryFn(args, api, extraOptions)
    },
    endpoints: builder => ({
        getExercises: builder.query({
            query: () => '/',
            skipCache: true
        }),
        getBadExercises: builder.query({
            query: () => '/bad_formalizations',
            skipCache: true
        }),
        getBadPropositions: builder.query({
            query: (exercise_id) => `/bad_formalizations/${exercise_id}`
        }),
        getBadFormalizations: builder.query({
            query: ({exercise_id, proposition_id}) => `/bad_formalizations/${exercise_id}/${proposition_id}`
        }),
        getBadFormalizationInfo: builder.query({
            query: ({exercise_id, bad_formalization_id}) => `/bad_formalization/${exercise_id}/${bad_formalization_id}`
        })
    })
})

export const {
    useGetExercisesQuery,
    useGetBadExercisesQuery,
    useGetBadPropositionsQuery,
    useGetBadFormalizationsQuery,
    useGetBadFormalizationInfoQuery
} = badFormalizationsSlice