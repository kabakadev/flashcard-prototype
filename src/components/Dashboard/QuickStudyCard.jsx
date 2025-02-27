"use client";

import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { Clock } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

const QuickStudyCard = () => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      mb: 4,
      overflow: "hidden",
      bgcolor: "primary.main",
      color: "primary.contrastText",
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              p: 1,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Clock size={20} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Quick Study
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
          Ready for a quick study session? Choose a deck to review and improve
          your mastery.
        </Typography>
        <Button
          variant="contained"
          fullWidth
          component={RouterLink}
          to="/study"
          sx={{
            bgcolor: "white",
            color: "primary.main",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.9)",
            },
            borderRadius: 2,
          }}
        >
          Start Studying
        </Button>
      </motion.div>
    </CardContent>
  </Card>
);

export default QuickStudyCard;
