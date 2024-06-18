import { apiSlice } from "./apiSlice";

const VOTES_URL = "/api/votes";

export const voteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    vote: builder.mutation({
      query: ({ pollId, option }) => ({
        url: VOTES_URL,
        method: "POST",
        body: { pollId, option },
      }),
    }),
    getVoteByPollId: builder.query({
      queryFn: ({ pollId, userId }) => ({
        url: `${VOTES_URL}/${pollId}/${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useVoteMutation, useGetVoteByPollIdQuery } = voteApiSlice;
