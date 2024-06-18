// CreatePollModal.js
import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useCreatePollMutation } from "../slices/pollsApiSlice";

// eslint-disable-next-line react/prop-types
const CreatePollModal = ({ show, onHide, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    options: [""],
    duration: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleAddOption = () => {
    setFormData({ ...formData, options: [...formData.options, ""] });
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...formData.options];
    updatedOptions.splice(index, 1);
    setFormData({ ...formData, options: updatedOptions });
  };

  const [createPoll, { isLoading }] = useCreatePollMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createPoll(formData).unwrap();
      onSuccess(result);
    } catch (error) {
      console.error("Failed to create poll:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create Poll</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter poll title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formOptions">
            <Form.Label>Options</Form.Label>
            {formData.options.map((option, index) => (
              <div key={index} className="d-flex mb-2 gap-2">
                <Form.Control
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
                <Button
                  variant="danger"
                  className="ml-2"
                  onClick={() => handleRemoveOption(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="secondary" onClick={handleAddOption}>
              Add Option
            </Button>
          </Form.Group>
          <Form.Group controlId="formDuration">
            <Form.Label>Duration (in minutes)</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              name="duration"
              required
            />
          </Form.Group>
          <Button
            className="mt-3"
            variant="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Poll"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePollModal;
