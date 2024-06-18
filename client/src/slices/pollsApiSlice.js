import { apiSlice } from "./apiSlice";

const POLLS_URL = "/api/polls";

export const pollsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPoll: builder.mutation({
      query: (data) => ({
        url: POLLS_URL,
        method: "POST",
        body: data,
      }),
    }),
    getPolls: builder.query({
      query: () => ({
        url: POLLS_URL,
        method: "GET",
      }),
    }),
    getPollById: builder.query({
      query: (id) => ({
        url: `${POLLS_URL}/${id}`,
        method: "GET",
      }),
    }),
    updatePoll: builder.mutation({
      query: ({ id, data }) => ({
        url: `${POLLS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deletePoll: builder.mutation({
      query: (id) => ({
        url: `${POLLS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    getPollResults: builder.query({
      query: (id) => ({
        url: `${POLLS_URL}/${id}/results`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreatePollMutation,
  useGetPollsQuery,
  useGetPollByIdQuery,
  useUpdatePollMutation,
  useDeletePollMutation,
  useGetPollResultQuery,
} = pollsApiSlice;
