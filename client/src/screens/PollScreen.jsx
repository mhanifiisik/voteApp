import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  ListGroup,
  ProgressBar,
  Button,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetPollByIdQuery } from "../slices/pollsApiSlice";
import {
  useGetVoteByPollIdQuery,
  useVoteMutation,
} from "../slices/voteApiSlice";
import Loader from "../components/Loader";

const PollScreen = () => {
  const { id } = useParams(); // Fetches the poll ID from the URL
  const { userInfo } = useSelector((state) => state.auth); // Fetches user info from Redux store

  // Query to fetch poll details by ID
  const {
    data: pollData,
    isLoading: pollLoading,
    error: pollError,
  } = useGetPollByIdQuery(id);

  // Query to check if the user has already voted on this poll
  const {
    data: votedData,
    isLoading: votedLoading,
    error: votedError,
  } = useGetVoteByPollIdQuery(
    { pollId: id, userId: userInfo?._id }, // Query parameters
    {
      skip: !userInfo?._id, // Skip query if user ID is not available
      refetchOnMountOrArgChange: true, // Refetch data on mount or when ID changes
    }
  );

  // Mutation hook for voting
  const [vote, { isLoading: voteLoading }] = useVoteMutation();

  // State to manage user's voting status
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOption, setVotedOption] = useState(null);
  const [pollExpired, setPollExpired] = useState(false);

  // Effect to handle user's voting status and poll expiration
  useEffect(() => {
    // Check if pollData is available and not expired
    if (pollData && new Date(pollData.expiresAt) < new Date()) {
      setPollExpired(true);
    } else {
      setPollExpired(false);
    }

    // Update voted status if data is available
    if (votedData && votedData.hasVoted) {
      setHasVoted(true);
      setVotedOption(votedData.option);
    } else {
      setHasVoted(false);
      setVotedOption(null);
    }
  }, [pollData, votedData]);

  // Function to handle user's vote
  const handleVote = async (option) => {
    try {
      const { data } = await vote({ pollId: id, option });
      if (data) {
        setHasVoted(true);
        setVotedOption(option);
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  // Loading state while fetching poll or voting
  if (pollLoading || votedLoading || voteLoading) return <Loader />;

  // Error handling for poll or vote status
  if (pollError) return <p>Error loading poll: {pollError.message}</p>;
  if (votedError) return <p>Error loading vote status: {votedError.message}</p>;

  return (
    <Container>
      <h1 className="my-4">Poll: {pollData.title}</h1>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{pollData.title}</Card.Title>
          <Card.Text>
            <strong>Creator:</strong> {pollData.creator.name}
          </Card.Text>
          {pollExpired ? (
            <Card.Text>
              <strong>Poll Status:</strong> Poll has expired
            </Card.Text>
          ) : (
            <>
              <Card.Text>
                <strong>Expires in:</strong> {pollData.expiresAt}
              </Card.Text>
              <Card.Text>
                <strong>Options:</strong>
              </Card.Text>
              <ListGroup variant="flush">
                {pollData.options.map((option, index) => (
                  <ListGroup.Item
                    key={index}
                    className={`d-flex justify-content-between ${
                      hasVoted ? "disabled" : "cursor-pointer"
                    }`}
                    onClick={() => !hasVoted && handleVote(option)}
                  >
                    {option}
                    {hasVoted && (
                      <ProgressBar
                        now={
                          (pollData.results && pollData.results[option]) || 0
                        }
                        label={`${
                          (pollData.results && pollData.results[option]) || 0
                        }%`}
                        variant="success"
                      />
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              {hasVoted && (
                <Card.Text className="mt-3">
                  You have voted for <strong>{votedOption}</strong>.
                </Card.Text>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PollScreen;
