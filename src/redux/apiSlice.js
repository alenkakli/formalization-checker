import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BACKEND_URL } from "../config";

export const apiSlice = createApi({

    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BACKEND_URL}/api`,
        prepareHeaders: (headers) => {
            headers.set("Authorization", "Bearer " + localStorage.getItem("formalization_checker_token"))
            return headers;
        }}),
    tagTypes: ['Exercises', 'Feedbacks'],
    endpoints: builder => ({
        getExercises: builder.query({
            query: () => '/exercises'
        }),
        getBadExercises: builder.query({
            query: () => '/exercises/bad_formalizations'
        }),
        getBadPropositions: builder.query({
            query: (exercise_id) => `/exercises/bad_formalizations/${exercise_id}`
        }),
        getBadFormalizations: builder.query({
            query: ({exercise_id, proposition_id}) => `/exercises/bad_formalizations/${exercise_id}/${proposition_id}`
        }),
        getBadFormalizationInfo: builder.query({
            query: ({exercise_id, bad_formalization_id}) => `/exercises/bad_formalization/${exercise_id}/${bad_formalization_id}`
        }),
        getFeedback: builder.query({
            query: (bad_formalization_id) => `/feedbacks/bad_formalization/${bad_formalization_id}`,
            // providesTags: (result, error, arg) => [{ type: 'Get', id: arg }]
            providesTags: (result, error, arg) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Get', id: arg })), 'Feedbacks']
                    : ['Feedbacks'],
        }),
        addFeedback: builder.mutation({
            query: initialPost => ({
                url: '/feedbacks',
                method: 'POST',
                body: initialPost
            }),
            invalidatesTags: ['Feedbacks'],
        }),
        updateFeedback: builder.mutation({
            query: post => ({
                url: `/feedbacks/${post.id}`,
                method: 'PATCH',
                body: post
            }),
            invalidatesTags: ['Feedbacks'],
        })
    })
})

export const {
    useGetExercisesQuery,
    useGetBadExercisesQuery,
    useGetBadPropositionsQuery,
    useGetBadFormalizationsQuery,
    useGetBadFormalizationInfoQuery,
    useGetFeedbackQuery,
    useAddFeedbackMutation,
    useUpdateFeedbackMutation
} = apiSlice