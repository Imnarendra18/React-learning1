import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Typography,
  Paper,
  Checkbox,
  Container,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Badge,
  Tooltip,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FlagIcon from '@mui/icons-material/Flag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

function TodoList() {
  // Initialize state from localStorage
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = localStorage.getItem('todos');
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (e) {
      console.error('Failed to load todos:', e);
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingPriority, setEditingPriority] = useState('medium');
  const [editingCategory, setEditingCategory] = useState('general');
  const [editingDueDate, setEditingDueDate] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: input,
        completed: false,
        priority: selectedPriority === 'all' ? 'medium' : selectedPriority,
        category: selectedCategory === 'all' ? 'general' : selectedCategory,
        dueDate: editingDueDate,
        description: '',
        createdAt: new Date().toISOString(),
      }]);
      setInput('');
      setEditingDueDate('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setEditingId(id);
      setEditingText(todo.text);
      setEditingPriority(todo.priority || 'medium');
      setEditingCategory(todo.category || 'general');
      setEditingDueDate(todo.dueDate || '');
      setEditingDescription(todo.description || '');
      setOpenDialog(true);
    }
  };

  const saveEdit = () => {
    if (editingText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId
          ? {
            ...todo,
            text: editingText,
            priority: editingPriority,
            category: editingCategory,
            dueDate: editingDueDate,
            description: editingDescription,
          }
          : todo
      ));
      setEditingId(null);
      setEditingText('');
      setEditingPriority('medium');
      setEditingCategory('general');
      setEditingDueDate('');
      setEditingDescription('');
      setOpenDialog(false);
    }
  };

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
  };

  const exportTodos = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const resetAllTodos = () => {
    if (window.confirm('Are you sure you want to delete all todos? This cannot be undone.')) {
      setTodos([]);
    }
  };

  const filterAndSortTodos = () => {
    let filtered = todos;

    // Filter by tab
    if (tabValue === 1) {
      filtered = filtered.filter(t => !t.completed);
    } else if (tabValue === 2) {
      filtered = filtered.filter(t => t.completed);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(t => t.priority === selectedPriority);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      sorted.sort((a, b) => (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1));
    } else if (sortBy === 'dueDate') {
      sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.text.localeCompare(b.text));
    }

    return sorted;
  };

  const filteredTodos = filterAndSortTodos();
  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const overdueCount = todos.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const isOverdue = (dueDate, completed) => {
    return !completed && dueDate && new Date(dueDate) < new Date();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          📋 Advanced Todo List
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Manage your tasks with priorities, categories, due dates, and more
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>Total Tasks</Typography>
              <Typography variant="h4">{totalCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>Completed</Typography>
              <Typography variant="h4" color="success.main">{completedCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>Pending</Typography>
              <Typography variant="h4" color="info.main">{totalCount - completedCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>Overdue</Typography>
              <Typography variant="h4" color="error.main">{overdueCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Input Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
          Add New Task
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Task description"
              placeholder="What needs to be done?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} label="Priority">
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              value={editingDueDate}
              onChange={(e) => setEditingDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button variant="contained" fullWidth onClick={addTodo} startIcon={<AddIcon />} sx={{ py: 1.5 }}>
              Add Task
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} label="Category">
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="work">Work</MenuItem>
                <MenuItem value="personal">Personal</MenuItem>
                <MenuItem value="shopping">Shopping</MenuItem>
                <MenuItem value="health">Health</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
                <MenuItem value="date">Date Created</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="alphabetical">Alphabetical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button fullWidth variant="outlined" onClick={() => setSearchQuery('')} startIcon={<ClearIcon />}>
              Clear Search
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Export as JSON">
              <Button fullWidth variant="outlined" onClick={exportTodos} startIcon={<DownloadIcon />}>
                Export
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      {totalCount > 0 && (
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} variant="fullWidth">
            <Tab label={`All (${totalCount})`} />
            <Tab label={`Active (${totalCount - completedCount})`} />
            <Tab label={`Completed (${completedCount})`} />
          </Tabs>
        </Paper>
      )}

      {/* Warnings */}
      {overdueCount > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          ⚠️ You have {overdueCount} overdue task{overdueCount > 1 ? 's' : ''}
        </Alert>
      )}

      {/* Todo List */}
      {filteredTodos.length > 0 ? (
        <Paper>
          <List>
            {filteredTodos.map((todo, index) => (
              <Box key={todo.id}>
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          edge="end"
                          onClick={() => startEdit(todo.id)}
                          size="small"
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          onClick={() => deleteTodo(todo.id)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemButton
                    role={undefined}
                    onClick={() => toggleTodo(todo.id)}
                    dense
                    sx={{ pr: 2 }}
                  >
                    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                      {todo.completed ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <RadioButtonUncheckedIcon color="action" />
                      )}
                    </Box>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                            {todo.text}
                          </span>
                          <Chip
                            size="small"
                            label={todo.priority}
                            color={getPriorityColor(todo.priority)}
                            variant="outlined"
                          />
                          <Chip
                            size="small"
                            label={todo.category}
                            variant="filled"
                          />
                          {isOverdue(todo.dueDate, todo.completed) && (
                            <Chip size="small" label="Overdue" color="error" />
                          )}
                          {todo.dueDate && !isOverdue(todo.dueDate, todo.completed) && (
                            <Chip
                              size="small"
                              icon={<CalendarTodayIcon />}
                              label={new Date(todo.dueDate).toLocaleDateString()}
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      secondary={todo.description && <span>{todo.description}</span>}
                      sx={{
                        color: todo.completed ? 'text.secondary' : 'text.primary',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {index < filteredTodos.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {totalCount === 0 ? '✨ No tasks yet. Create one to get started!' : '🔍 No tasks match your filters.'}
          </Typography>
        </Paper>
      )}

      {/* Action Buttons */}
      {totalCount > 0 && (
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          {completedCount > 0 && (
            <Button variant="outlined" onClick={clearCompleted} color="warning">
              Clear Completed ({completedCount})
            </Button>
          )}
          <Button variant="outlined" onClick={resetAllTodos} color="error" startIcon={<RestartAltIcon />}>
            Reset All
          </Button>
        </Stack>
      )}

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Task"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={editingDescription}
            onChange={(e) => setEditingDescription(e.target.value)}
            multiline
            maxRows={4}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select value={editingPriority} onChange={(e) => setEditingPriority(e.target.value)} label="Priority">
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select value={editingCategory} onChange={(e) => setEditingCategory(e.target.value)} label="Category">
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="work">Work</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="shopping">Shopping</MenuItem>
              <MenuItem value="health">Health</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            value={editingDueDate}
            onChange={(e) => setEditingDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={saveEdit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TodoList;