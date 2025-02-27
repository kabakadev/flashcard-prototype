"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from "@mui/material";
import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getRelativeTime } from "../../utils/dashBoardutil";

const DeckCard = ({ deck, deckStats, theme, navigate }) => (
  <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent
        sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            {deck.title}
          </Typography>
        </Box>
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            {deck.description || "No description available."}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {deckStats.cardsLearned} / {deck.card_count || 0} learned
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Last studied: {getRelativeTime(deckStats.lastStudied)}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Mastery
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.primary", fontWeight: "bold" }}
              >
                {deckStats.mastery}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={deckStats.mastery}
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
          </Box>
        </Box>
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<PlayCircle size={18} />}
            onClick={() => navigate(`/study/${deck.id}`)}
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: "primary.dark",
              },
              borderRadius: 2,
            }}
          >
            Study Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

export default DeckCard;
