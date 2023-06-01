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
            query: bad_formalization_id => ({
                url: `all/bad_formalization/${bad_formalization_id}`,
                method: 'GET'
            }),
            providesTags: (result, error, id) => [{ type: 'Feedbacks', id }]

        }),
        getRating: builder.query({
            query: ({solution_id, feedback_id}) => ({
                url: `/rating/${solution_id}/${feedback_id}`,
                method: 'GET'
            }),
        }),
        addFeedback: builder.mutation({
            query: feedback => ({
                url: '/',
                method: 'POST',
                body: feedback
            }),
            invalidatesTags: (result, error, feedback) => [{ type: 'Feedbacks', id: feedback.bad_formalization_id }],
        }),
        updateFeedback: builder.mutation({
            query: feedback => ({
                url: `/${feedback.id}`,
                method: 'PATCH',
                body: feedback
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Feedbacks', id: id.bad_formalization_id }]
        })

    }),
})

export const {
    useGetFeedbacksQuery,
    useGetRatingQuery,
    useAddFeedbackMutation,
    useUpdateFeedbackMutation
} = feedbacksSlice