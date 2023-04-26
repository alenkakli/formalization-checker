import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const feedbacksSlice = createApi({

    reducerPath: 'feedbacks',
    baseQuery: function _q(args, api, extraOptions) {
      if (_q.queryFn === undefined) {
        _q.queryFn = fetchBaseQuery({
          baseUrl: `${api.getState().backend.url}/api/feedbacks`,
          prepareHeaders: (headers) => {
              headers.set("Authorization", "Bearer " + localStorage.getItem("formalization_checker_token"))
              return headers;
          }})
      }
      return _q.queryFn(args, api, extraOptions)
    },
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