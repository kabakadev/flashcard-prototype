"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";

const LearningTipsCard = () => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      overflow: "hidden",
    }}
  >
    <CardContent sx={{ p: 0 }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Brain size={20} />
          Learning Tips
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ color: "text.primary", mb: 2 }}>
            Improve your retention with these strategies:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 0 }}>
            {[
              "Study in short, focused sessions rather than long marathons",
              "Review cards right before bedtime to improve memory consolidation",
              "Explain concepts out loud to enhance understanding",
              "Connect new information to things you already know",
            ].map((tip, index) => (
              <Box
                component="li"
                key={index}
                sx={{ mb: 1, color: "text.secondary" }}
              >
                <Typography variant="body2">{tip}</Typography>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Box>
    </CardContent>
  </Card>
);

export default LearningTipsCard;
