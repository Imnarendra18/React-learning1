// src/App.js
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Paper,
  Grid,
  IconButton,
  Divider,
  Container,
  Card,
  CardContent,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import BookIcon from "@mui/icons-material/Book";

/*
 Student object shape:
 {
   id: number,
   name: string,
   grade: 'A'|'B'|'C'|'D'|'E',
   subjects: string[]   // simple list of subject names
 }
*/

const initialStudents = [
  {
    id: 1,
    name: "Alice",
    grade: "A",
    subjects: ["Math", "Physics", "Chemistry"]
  },
  {
    id: 2,
    name: "Bob",
    grade: "C",
    subjects: ["English", "History"]
  },
  {
    id: 3,
    name: "Charlie",
    grade: "B",
    subjects: ["Math", "Biology"]
  }
];

function Std() {
  const [students, setStudents] = useState(initialStudents);
  const [selectedId, setSelectedId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Add a new student
  function addStudent(name, grade, subjectsText) {
    if (!name.trim()) return;
    const subjects = subjectsText
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    const newStudent = {
      id: Date.now(), // simple unique id for demo
      name,
      grade: grade || "E",
      subjects
    };
    // immutably add the student (new array)
    setStudents(prev => [newStudent, ...prev]);
    setSelectedId(newStudent.id);
    setOpenDialog(false);
  }

  // Delete student by id
  function deleteStudent(id) {
    setStudents(prev => prev.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  // Update a student (name / grade / subjects)
  function updateStudent(id, changes) {
    setStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, ...changes } : s))
    );
  }

  const selectedStudent = students.find(s => s.id === selectedId) || null;
  const gradeStats = {
    A: students.filter(s => s.grade === 'A').length,
    B: students.filter(s => s.grade === 'B').length,
    C: students.filter(s => s.grade === 'C').length,
    D: students.filter(s => s.grade === 'D').length,
    E: students.filter(s => s.grade === 'E').length,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon sx={{ fontSize: 40 }} />
          Student Grade Management System
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Manage student grades and track their academic progress
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h4">{students.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {Object.entries(gradeStats).map(([grade, count]) => (
          <Grid item xs={6} sm={6} md={2} key={grade}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 1.5 }}>
                <Typography color="textSecondary" variant="body2" gutterBottom>
                  Grade {grade}
                </Typography>
                <Typography variant="h5">{count}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column - Form & List */}
        <Grid item xs={12} md={5}>
          {/* Add Student Button */}
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ mb: 2, py: 1.5 }}
          >
            Add New Student
          </Button>

          {/* Student List */}
          <Paper sx={{ overflow: 'hidden' }}>
            <List>
              {students.map((student, index) => (
                <Box key={student.id}>
                  <ListItem
                    disablePadding
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => deleteStudent(student.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      selected={student.id === selectedId}
                      onClick={() => setSelectedId(student.id)}
                    >
                      <Badge
                        badgeContent={student.subjects.length}
                        color="primary"
                        sx={{ mr: 1.5 }}
                      >
                        <PersonIcon />
                      </Badge>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {student.name}
                            <Chip
                              label={`Grade ${student.grade}`}
                              size="small"
                              color={
                                student.grade === 'A'
                                  ? 'success'
                                  : student.grade === 'B'
                                    ? 'info'
                                    : student.grade === 'C'
                                      ? 'warning'
                                      : 'error'
                              }
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={`${student.subjects.length} subjects`}
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < students.length - 1 && <Divider />}
                </Box>
              ))}
              {students.length === 0 && (
                <ListItem>
                  <ListItemText primary="No students yet. Add one to get started!" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={7}>
          {selectedStudent ? (
            <StudentDetails
              student={selectedStudent}
              onUpdate={changes => updateStudent(selectedStudent.id, changes)}
              onDelete={() => deleteStudent(selectedStudent.id)}
            />
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, mx: 'auto' }} />
              <Typography variant="h6" color="textSecondary">
                Select a student or add a new one
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Click on a student from the list to view and manage their details
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Add Student Dialog */}
      <AddStudentDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onAdd={addStudent}
      />
    </Container>
  );
}

/* Add Student Dialog Component */
function AddStudentDialog({ open, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("A");
  const [subjects, setSubjects] = useState("");

  const handleAdd = () => {
    onAdd(name, grade, subjects);
    setName("");
    setGrade("A");
    setSubjects("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Student</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth
          label="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
          placeholder="e.g., John Doe"
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Grade</InputLabel>
          <Select value={grade} onChange={(e) => setGrade(e.target.value)} label="Grade">
            <MenuItem value="A">A - Excellent</MenuItem>
            <MenuItem value="B">B - Good</MenuItem>
            <MenuItem value="C">C - Average</MenuItem>
            <MenuItem value="D">D - Below Average</MenuItem>
            <MenuItem value="E">E - Poor</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Subjects"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          placeholder="e.g., Math, Physics, Chemistry"
          helperText="Comma-separated subject names"
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained">
          Add Student
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* StudentList: shows list + delete */
function StudentList({ students, onSelect, onDelete, selectedId }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Students ({students.length})
      </Typography>
      <List>
        {students.map(s => (
          <ListItem
            key={s.id}
            secondaryAction={
              <Box>
                <Button size="small" onClick={() => onSelect(s.id)} sx={{ mr: 1 }}>
                  View
                </Button>
                <IconButton edge="end" onClick={() => onDelete(s.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
            sx={{ bgcolor: s.id === selectedId ? 'action.selected' : 'inherit' }}
          >
            <ListItemButton onClick={() => onSelect(s.id)}>
              <ListItemText
                primary={`${s.name} (${s.grade})`}
                secondary={`Subjects: ${s.subjects.length ? s.subjects.join(", ") : "—"}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

/* StudentDetails: view / edit subjects and grade */
function StudentDetails({ student, onUpdate, onDelete }) {
  const [newSubject, setNewSubject] = useState("");
  const [editingName, setEditingName] = useState(student.name);
  const [editingGrade, setEditingGrade] = useState(student.grade);

  // If the selected student changes, update local edit fields:
  React.useEffect(() => {
    setEditingName(student.name);
    setEditingGrade(student.grade);
    setNewSubject("");
  }, [student.id, student.name, student.grade]);

  function addSubject() {
    const sub = newSubject.trim();
    if (!sub) return;
    // update nested array immutably
    onUpdate({ subjects: [...student.subjects, sub] });
    setNewSubject("");
  }

  function removeSubject(index) {
    const next = student.subjects.filter((_, i) => i !== index);
    onUpdate({ subjects: next });
  }

  function saveName() {
    onUpdate({ name: editingName });
  }

  function saveGrade(e) {
    const g = e.target.value;
    setEditingGrade(g);
    onUpdate({ grade: g });
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Student Details
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Name"
          value={editingName}
          onChange={e => setEditingName(e.target.value)}
          fullWidth
          sx={{ mb: 1 }}
        />
        <Button onClick={saveName} variant="outlined" size="small">
          Save Name
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Grade</InputLabel>
          <Select value={editingGrade} onChange={saveGrade} label="Grade">
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="B">B</MenuItem>
            <MenuItem value="C">C</MenuItem>
            <MenuItem value="D">D</MenuItem>
            <MenuItem value="E">E</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Subjects
      </Typography>
      <List>
        {student.subjects.map((sub, idx) => (
          <ListItem
            key={idx}
            secondaryAction={
              <IconButton edge="end" onClick={() => removeSubject(idx)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={sub} />
          </ListItem>
        ))}
        {student.subjects.length === 0 && (
          <ListItem>
            <ListItemText primary="No subjects yet." />
          </ListItem>
        )}
      </List>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <TextField
          label="New subject"
          value={newSubject}
          onChange={e => setNewSubject(e.target.value)}
          fullWidth
        />
        <Button onClick={addSubject} variant="contained">
          Add
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Button onClick={onDelete} variant="contained" color="error">
          Delete Student
        </Button>
      </Box>
    </Paper>
  );
}

export default Std;
