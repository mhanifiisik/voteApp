import { Table, Button } from "react-bootstrap";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserByIdMutation,
} from "../slices/usersApiSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserManagement() {
  const { data: users, error, isLoading, refetch } = useGetUsersQuery();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserByIdMutation();

  const handleDeleteUser = async (id) => {
    await deleteUser(id).unwrap();
    refetch();
  };

  const handleUpdateUser = async (id, updatedUserData) => {
    await updateUser({
      id,
      data: updatedUserData,
    }).unwrap();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>User Management</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteUser(user._id)}
                    disabled={isDeleting}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleUpdateUser(user._id, {
                        role: user.role === "ADMIN" ? "USER" : "ADMIN",
                      })
                    }
                  >
                    {user.role === "ADMIN"
                      ? "Demote to User"
                      : "Promote to Admin"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ToastContainer autoClose={3000} position="top-right" />
    </div>
  );
}
