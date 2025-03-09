import { Card, Typography, Button } from "@mui/material";
import { GraduationCap, Plus } from "lucide-react";
import { memo } from "react";

const EmptyState = ({ theme, onCreateDeck }) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      p: 6,
      textAlign: "center",
      bgcolor: "background.paper",
    }}
  >
    <GraduationCap
      size={48}
      color={theme.palette.primary.main}
      style={{ marginBottom: 16 }}
    />
    <Typography
      variant="h5"
      sx={{ color: "text.primary", mb: 2, fontWeight: "bold" }}
    >
      Start Your Learning Journey
    </Typography>
    <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
      Create your first flashcard deck and begin mastering new subjects.
    </Typography>
    <Button
      variant="contained"
      startIcon={<Plus size={18} />}
      onClick={onCreateDeck}
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
);

// Export as memoized component
export default memo(EmptyState);
