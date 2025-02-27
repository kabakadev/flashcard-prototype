import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

const FilterSort = ({
  subjects,
  categories,
  filter,
  setFilter,
  sortBy,
  setSortBy,
}) => {
  const difficultyLevels = [1, 2, 3, 4, 5];

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Subject</InputLabel>
        <Select
          value={filter.subject}
          onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
          label="Subject"
        >
          <MenuItem value="">All</MenuItem>
          {subjects.map((subject) => (
            <MenuItem key={subject} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          label="Category"
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Difficulty</InputLabel>
        <Select
          value={filter.difficulty}
          onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
          label="Difficulty"
        >
          <MenuItem value="">All</MenuItem>
          {difficultyLevels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
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
        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
      />
    </Box>
  );
};

export default FilterSort;
