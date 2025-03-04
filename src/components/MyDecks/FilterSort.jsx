"use client";

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { memo, useMemo } from "react";

const FilterSort = ({
  subjects,
  categories,
  filter,
  setFilter,
  sortBy,
  setSortBy,
}) => {
  // Memoize the difficulty levels array to prevent recreation on each render
  const difficultyLevels = useMemo(() => [1, 2, 3, 4, 5], []);

  // Memoize the subject menu items
  const subjectMenuItems = useMemo(() => {
    return subjects.map((subject) => (
      <MenuItem key={subject} value={subject}>
        {subject}
      </MenuItem>
    ));
  }, [subjects]);

  // Memoize the category menu items
  const categoryMenuItems = useMemo(() => {
    return categories.map((category) => (
      <MenuItem key={category} value={category}>
        {category}
      </MenuItem>
    ));
  }, [categories]);

  // Memoize the difficulty menu items
  const difficultyMenuItems = useMemo(() => {
    return difficultyLevels.map((level) => (
      <MenuItem key={level} value={level}>
        {level}
      </MenuItem>
    ));
  }, [difficultyLevels]);

  // Handle filter changes with a single function
  const handleFilterChange = (field, value) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Subject</InputLabel>
        <Select
          value={filter.subject}
          onChange={(e) => handleFilterChange("subject", e.target.value)}
          label="Subject"
        >
          <MenuItem value="">All</MenuItem>
          {subjectMenuItems}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={filter.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          label="Category"
        >
          <MenuItem value="">All</MenuItem>
          {categoryMenuItems}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Difficulty</InputLabel>
        <Select
          value={filter.difficulty}
          onChange={(e) => handleFilterChange("difficulty", e.target.value)}
          label="Difficulty"
        >
          <MenuItem value="">All</MenuItem>
          {difficultyMenuItems}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          label="Sort By"
        >
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="lastStudied">Last Studied</MenuItem>
          <MenuItem value="difficulty">Difficulty</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Search"
        variant="outlined"
        value={filter.search}
        onChange={(e) => handleFilterChange("search", e.target.value)}
      />
    </Box>
  );
};

// Export as memoized component
export default memo(FilterSort);
