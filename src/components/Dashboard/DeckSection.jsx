"use client";

import { Box, Button, Grid, Typography, Card } from "@mui/material";
import { BookOpen, Plus } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import DeckCard from "./DeckCard";
import { motion } from "framer-motion";

const DecksSection = ({ decks, getDeckStats, navigate, theme }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <BookOpen size={24} />
          Recent Decks
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          component={RouterLink}
          to="/mydecks"
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            borderRadius: 2,
          }}
        >
          Create Deck
        </Button>
      </Box>

      <Grid container spacing={3}>
        {decks.length > 0 ? (
          decks.slice(0, 4).map((deck) => {
            const deckStats = getDeckStats(deck.id);
            return (
              <Grid item xs={12} sm={6} key={deck.id}>
                <motion.div variants={itemVariants}>
                  <DeckCard
                    deck={deck}
                    deckStats={deckStats}
                    theme={theme}
                    navigate={navigate}
                  />
                </motion.div>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" sx={{ color: "text.secondary", mb: 2 }}>
                You don't have any decks yet
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                component={RouterLink}
                to="/mydecks"
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  borderRadius: 2,
                }}
              >
                Create Your First Deck
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>

      {decks.length > 4 && (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/mydecks"
            sx={{
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                borderColor: "primary.dark",
                bgcolor: "rgba(124, 58, 237, 0.04)",
              },
              borderRadius: 2,
            }}
          >
            View All Decks
          </Button>
        </Box>
      )}
    </motion.div>
  );
};

export default DecksSection;
