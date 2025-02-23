"use client"

import { useNavigate, Link as RouterLink } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { Container, Card, CardContent, Typography, TextField, Button, Link, Box, Alert } from "@mui/material"
import { motion } from "framer-motion"
import ThemeToggle from "../ThemeComponents/ThemeToggle"

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  username: Yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

const Signup = () => {
  const { signup } = useUser()
  const navigate = useNavigate()

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <ThemeToggle />
      </Box>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 0 0 1px rgba(59, 130, 246, 0.5)"
                : "0 0 0 1px rgba(152, 245, 225, 0.5)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  mb: 1,
                }}
              >
                Create Account
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                }}
              >
                Join Flashlearn and start your learning journey
              </Typography>
            </Box>

            <Formik
              initialValues={{ email: "", username: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                  const success = await signup(values.email, values.username, values.password)
                  if (success) {
                    navigate("/dashboard")
                  }
                } catch (error) {
                  setErrors({ general: error.message || "Signup failed" })
                }
                setSubmitting(false)
              }}
            >
              {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
                <Form>
                  {errors.general && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {errors.general}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    id="username"
                    name="username"
                    label="Username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    sx={{ mb: 3 }}
                  />

                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    fullWidth
                    size="large"
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    sx={{
                      bgcolor: (theme) => (theme.palette.mode === "dark" ? "#3b82f6" : "#ffd4f7"),
                      color: (theme) => (theme.palette.mode === "dark" ? "white" : "text.primary"),
                      "&:hover": {
                        bgcolor: (theme) => (theme.palette.mode === "dark" ? "#2563eb" : "#ffc4e7"),
                      },
                      mb: 2,
                    }}
                  >
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </Button>

                  <Typography variant="body2" align="center" sx={{ color: "text.secondary" }}>
                    Already have an account?{" "}
                    <Link
                      component={RouterLink}
                      to="/login"
                      sx={{
                        color: (theme) => (theme.palette.mode === "dark" ? "#3b82f6" : "#ffd4f7"),
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Sign in here
                    </Link>
                  </Typography>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  )
}

export default Signup

