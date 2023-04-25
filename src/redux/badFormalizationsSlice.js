import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {BACKEND_URL} from "../config";

export const badFormalizationsSlice = createApi({

    reducerPath: 'bad_formalizations',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BACKEND_URL}/api/exercises`,
        prepareHeaders: (headers) => {
            headers.set("Authorization", "Bearer " + localStorage.getItem("token"))
            return headers
        }}),
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