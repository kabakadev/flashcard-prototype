"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Grid, Typography, Button, Container } from "@mui/material";

export default function HeroSection({ isDarkMode }) {
  return (
    <Box
      sx={{
        py: 10,
        bgcolor: isDarkMode ? "background.default" : "background.nav",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  color: "text.primary",
                  lineHeight: 1.2,
                }}
              >
                Master Any Subject with Smart Flashcards
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: "text.secondary",
                  fontWeight: "normal",
                }}
              >
                Create personalized decks, track your progress, and optimize
                your learning with spaced repetition.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                  endIcon={<ArrowRight />}
                >
                  Start learning for free
                </Button>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                sx={{
                  position: "relative",
                  height: "400px",
                  width: "100%",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1625750331870-624de6fd3452?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1hc3Rlcnl8ZW58MHx8MHx8fDA%3D"
                  alt="Chess king representing mastery"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
