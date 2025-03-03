import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  IconButton,
  Button,
} from "@mui/material";
import { Pencil, Trash2, PlayCircle, Eye } from "lucide-react"; // Import the Eye icon
import { motion } from "framer-motion";

const DeckCard = ({ deck, theme, onEdit, onDelete, onStudy, navigate }) => (
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
            sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
          >
            {deck.title}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
              Difficulty: {deck.difficulty}/5
            </Typography>
          </Box>
        </Box>
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            {deck.description || "No description available."}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {deck.card_count || 0} cards
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Last studied: {deck.last_studied || "Never"}
            </Typography>
          </Box>
          {deck.mastery !== undefined && (
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
                  {deck.mastery}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={deck.mastery}
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
          )}
        </Box>
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <IconButton
              size="small"
              onClick={(e) => onEdit(e, deck)}
              sx={{
                mr: 1,
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <Pencil size={18} />
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => onDelete(e, deck.id)}
              sx={{ color: "error.main", "&:hover": { color: "error.dark" } }}
            >
              <Trash2 size={18} />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Eye size={18} />} // Add the Eye icon
              onClick={() => navigate(`/mydecks/${deck.id}`)} // Navigate to deck details
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
              View
            </Button>
            <Button
              variant="contained"
              startIcon={<PlayCircle size={18} />}
              onClick={(e) => onStudy(e, deck.id)}
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
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

export default DeckCard;
