import { Button, Card, Container } from "react-bootstrap";

const HomeScreen = () => {
  return (
    <div className=" py-5">
      <Container className="d-flex justify-content-center">
        <Card className="p-5 d-flex flex-column align-items-center hero-card bg-light w-100">
          <h1 className="text-center mb-4">Vote Application </h1>
          <p className="text-center mb-4">
            Vote application is a simple application that allows users to create
            polls and vote on them
          </p>
          <div className="d-flex">
            <Button variant="primary" href="/login" className="me-3">
              Sign In
            </Button>
            <Button variant="secondary" href="/register">
              Register
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};
export default HomeScreen;
