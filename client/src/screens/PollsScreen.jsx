import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetPollsQuery } from "../slices/pollsApiSlice";
import CreatePollModal from "../components/CreatePollModal";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

const PollsScreen = () => {
  const { data: pollsData, error, isLoading, refetch } = useGetPollsQuery();
  const { userInfo } = useSelector((state) => state.auth);

  const [polls, setPolls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMyPolls, setShowMyPolls] = useState(false);

  useEffect(() => {
    if (pollsData) {
      setPolls(pollsData);
    }
  }, [pollsData]);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleCreatePollSuccess = () => {
    handleCloseModal();
    refetch();
  };

  const handleTogglePolls = () => {
    setShowMyPolls((prevState) => !prevState);
    if (!showMyPolls) {
      setPolls(pollsData.filter((poll) => poll.creator._id === userInfo._id));
    } else {
      setPolls(pollsData);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading polls: {error.message}</p>;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="my-4">Polls</h1>
        <div className="d-flex gap-3">
          <Button variant="primary" onClick={handleShowModal}>
            Create Poll
          </Button>
          <Button variant="primary" onClick={handleTogglePolls}>
            {showMyPolls ? "All Polls" : "My Polls"}
          </Button>

          {userInfo.role === "ADMIN" && (
            <Button variant="primary" onClick={handleTogglePolls}>
              <Link to={`/admin`} className="text-white text-decoration-none">
                Get All Users
              </Link>
            </Button>
          )}
        </div>
      </div>
      <Row className="gy-4">
        {polls.length === 0 && (
          <Col>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>No polls found</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        )}
        {polls?.map((poll) => (
          <Col key={poll._id} sm={12} md={6} lg={4} className="d-flex">
            <Card className="mb-4 h-100 w-100">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title>{poll.title}</Card.Title>
                  <Card.Text>
                    <strong>Options:</strong> {poll.options.length}
                  </Card.Text>
                  <Card.Text>
                    <strong>Creator:</strong> {poll.creator.name}
                  </Card.Text>
                  <Card.Text>
                    <strong>Expires:</strong>{" "}
                    {new Date(poll.expiresAt).toLocaleString()}
                  </Card.Text>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Badge
                    bg={
                      new Date(poll.expiresAt) > new Date()
                        ? "success"
                        : "danger"
                    }
                  >
                    {new Date(poll.expiresAt) > new Date()
                      ? "Active"
                      : "Expired"}
                  </Badge>
                  <Button variant="primary" as={Link} to={`/poll/${poll._id}`}>
                    View Poll
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <CreatePollModal
        show={showModal}
        onHide={handleCloseModal}
        onSuccess={handleCreatePollSuccess}
      />
    </Container>
  );
};

export default PollsScreen;
