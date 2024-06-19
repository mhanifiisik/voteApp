import { useState, useEffect } from "react";
import { Container, Card, ListGroup, ProgressBar } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetPollDetailsQuery } from "../slices/pollsApiSlice";
import { useVoteMutation } from "../slices/voteApiSlice";
import Loader from "../components/Loader";
import PollResultsChart from "../components/PollResultsChart";

const PollScreen = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: pollDetails,
    isLoading: pollLoading,
    error: pollError,
  } = useGetPollDetailsQuery(id, {
    skip: !userInfo,
    refetchOnMountOrArgChange: true,
  });

  const [vote, { isLoading: voteLoading }] = useVoteMutation();

  const [hasVoted, setHasVoted] = useState(false);
  const [votedOption, setVotedOption] = useState(null);
  const [pollExpired, setPollExpired] = useState(false);

  useEffect(() => {
    if (pollDetails) {
      setPollExpired(pollDetails.isExpired);
      setHasVoted(!!pollDetails.userVote);
      setVotedOption(pollDetails.userVote);
    }
  }, [pollDetails]);

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

  if (pollLoading || voteLoading) return <Loader />;

  if (pollError) return <p>Error loading poll: {pollError.message}</p>;

  const pollResults = pollDetails.poll.results
    ? Object.entries(pollDetails.poll.results).map(([option, votes]) => ({
        name: option,
        value: votes,
      }))
    : [];

  return (
    <Container>
      <h1 className="my-4">Poll: {pollDetails.poll.title}</h1>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{pollDetails.poll.title}</Card.Title>
          <Card.Text>
            <strong>Creator:</strong> {pollDetails.poll.creator.name}
          </Card.Text>
          {pollExpired ? (
            <Card.Text>
              <strong>Poll Status:</strong> Poll has expired
            </Card.Text>
          ) : (
            <>
              <Card.Text>
                <strong>Expires at:</strong>{" "}
                {new Date(pollDetails.poll.expiresAt).toLocaleString()}
              </Card.Text>
              <Card.Text>
                <strong>Options:</strong>
              </Card.Text>
              <ListGroup variant="flush">
                {pollDetails.poll.options.map((option, index) => (
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
                          (pollDetails.poll.results &&
                            pollDetails.poll.results[option]) ||
                          0
                        }
                        label={`${
                          (pollDetails.poll.results &&
                            pollDetails.poll.results[option]) ||
                          0
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
      {pollExpired && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Poll Results</Card.Title>
            <PollResultsChart data={pollResults} />
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default PollScreen;
