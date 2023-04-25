import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {BACKEND_URL} from "../config";

export const feedbacksSlice = createApi({

    reducerPath: 'feedbacks',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BACKEND_URL}/api/feedbacks`,
        prepareHeaders: (headers) => {
            headers.set("Authorization", "Bearer " + localStorage.getItem("token"))
            return headers
        }}),
    tagTypes: ['Feedbacks'],
    endpoints: builder => ({
        getFeedbacks: builder.query({
            query: (bad_formalization_id) => ({
                url: `all/bad_formalization/${bad_formalization_id.bad_formalization_id}`,
                method: 'GET'
            }),
            skipCache: true,
            providesTags: ['Feedbacks'],
        }),
        addFeedback: builder.mutation({
            query: initialPost => ({
                url: '/',
                method: 'POST',
                body: initialPost
            }),
            invalidatesTags: ['Feedbacks'],
        }),
        updateFeedback: builder.mutation({
            query: post => ({
                url: `/${post.id}`,
                method: 'PATCH',
                body: post
            }),
            invalidatesTags: ['Feedbacks'],
        })

    }),
})

export const {
    useGetFeedbacksQuery,
    useAddFeedbackMutation,
    useUpdateFeedbackMutation
} = feedbacksSlice