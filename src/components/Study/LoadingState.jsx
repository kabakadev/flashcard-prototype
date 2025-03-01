"use client";

import { motion } from "framer-motion";
import { Box, Typography, useTheme } from "@mui/material";
import { Brain } from "lucide-react";

const LoadingState = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <Brain size={40} color={theme.palette.primary.main} />
      </motion.div>
      <Typography variant="h6" color="text.secondary">
        Loading study data...
      </Typography>
    </Box>
  );
};

export default LoadingState;
