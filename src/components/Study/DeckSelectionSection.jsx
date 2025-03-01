"use client";

import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { BookOpen, PlayCircle, Brain } from "lucide-react";
import { getDeckStats, getRelativeTime } from "./studyUtils";

// Animation variants
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

const DeckSelectionSection = ({ decks, progress, navigate }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "text.primary",
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 3,
        }}
      >
        <BookOpen size={24} />
        Choose a Deck to Study
      </Typography>

      {decks.length === 0 ? (
        <EmptyDeckState navigate={navigate} theme={theme} />
      ) : (
        <Grid container spacing={3}>
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              progress={progress}
              navigate={navigate}
              theme={theme}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};

const EmptyDeckState = ({ navigate, theme }) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      p: 6,
      textAlign: "center",
    }}
  >
    <Brain
      size={48}
      color={theme.palette.primary.main}
      style={{ marginBottom: 16 }}
    />
    <Typography
      variant="h5"
      sx={{ color: "text.primary", mb: 2, fontWeight: "bold" }}
    >
      No Decks Available
    </Typography>
    <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
      Create your first deck to start studying!
    </Typography>
    <Button
      variant="contained"
      onClick={() => navigate("/mydecks")}
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        "&:hover": {
          bgcolor: "primary.dark",
        },
      }}
    >
      Create New Deck
    </Button>
  </Card>
);

const DeckCard = ({ deck, progress, navigate, theme }) => {
  const stats = getDeckStats(deck.id, progress);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            height: "100%",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            },
          }}
          onClick={() => navigate(`/study/${deck.id}`)}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                p: 3,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  mb: 1,
                }}
              >
                {deck.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    bgcolor: "background.default",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {deck.subject || "No Subject"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    bgcolor: "background.default",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {stats.cardsLearned} / {deck.card_count || 0} learned
                </Typography>
              </Box>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                {deck.description || "No description available."}
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Mastery Level
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.primary",
                      fontWeight: "bold",
                    }}
                  >
                    {Math.round(stats.mastery)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.mastery}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "primary.main",
                      borderRadius: 3,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    mt: 1,
                    display: "block",
                  }}
                >
                  Last studied: {getRelativeTime(stats.lastStudied)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                startIcon={<PlayCircle size={18} />}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Start Studying
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  );
};

export default DeckSelectionSection;
