import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Signup = () => {
  const { signup } = useUser();
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    username: Yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  return (
    <div>
      <h2>Signup</h2>
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const success = await signup(values.email, values.username, values.password);
            if (success) {
              alert("Signup successful!");
              navigate("/dashboard");
            }
          } catch (error) {
            setErrors({ general: error.message || "Signup failed" });
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

            <div>
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage name="email" component="p" style={{ color: "red" }} />
            </div>

            <div>
              <Field type="text" name="username" placeholder="Username" />
              <ErrorMessage name="username" component="p" style={{ color: "red" }} />
            </div>

            <div>
              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" component="p" style={{ color: "red" }} />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing up..." : "Signup"}
            </button>
          </Form>
        )}
      </Formik>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;
