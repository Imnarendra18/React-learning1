// src/App.js
import React, { useState } from "react";

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
    subjects: ["Math", "Physics"]
  },
  {
    id: 2,
    name: "Bob",
    grade: "C",
    subjects: ["English", "History"]
  }
];

function Std() {
  const [students, setStudents] = useState(initialStudents);
  const [selectedId, setSelectedId] = useState(null);

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

  return (
    <div style={styles.app}>
      <h1>Student Grade Management</h1>
      <div style={styles.container}>
        <div style={styles.left}>
          <StudentForm onAdd={addStudent} />
          <StudentList
            students={students}
            onSelect={setSelectedId}
            onDelete={deleteStudent}
            selectedId={selectedId}
          />
        </div>

        <div style={styles.right}>
          {selectedStudent ? (
            <StudentDetails
              student={selectedStudent}
              onUpdate={changes => updateStudent(selectedStudent.id, changes)}
              onDelete={() => deleteStudent(selectedStudent.id)}
            />
          ) : (
            <div style={styles.placeholder}>
              Pick a student to view details or add a new student on the left.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* StudentForm: add new student */
function StudentForm({ onAdd }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("A");
  const [subjects, setSubjects] = useState(""); // comma separated

  function handleAdd(e) {
    e.preventDefault();
    onAdd(name, grade, subjects);
    setName("");
    setGrade("A");
    setSubjects("");
  }

  return (
    <form onSubmit={handleAdd} style={styles.form}>
      <h3>Add Student</h3>
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={styles.input}
      />
      <select value={grade} onChange={e => setGrade(e.target.value)} style={styles.input}>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="E">E</option>
      </select>
      <input
        placeholder="Subjects (comma separated)"
        value={subjects}
        onChange={e => setSubjects(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Add Student</button>
    </form>
  );
}

/* StudentList: shows list + delete */
function StudentList({ students, onSelect, onDelete, selectedId }) {
  return (
    <div>
      <h3>Students ({students.length})</h3>
      <ul style={styles.list}>
        {students.map(s => (
          <li
            key={s.id}
            style={{
              ...styles.listItem,
              background: s.id === selectedId ? "#eef" : "white"
            }}
          >
            <div style={{flex:1}}>
              <strong>{s.name}</strong> <span>({s.grade})</span>
              <div style={styles.smallText}>
                Subjects: {s.subjects.length ? s.subjects.join(", ") : "—"}
              </div>
            </div>
            <div style={styles.listButtons}>
              <button onClick={() => onSelect(s.id)} style={styles.smallBtn}>View</button>
              <button onClick={() => onDelete(s.id)} style={styles.smallBtnDanger}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
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
  }, [student.id]);

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
    <div>
      <h2>Details</h2>
      <div style={styles.detailsRow}>
        <label style={styles.label}>Name:</label>
        <input value={editingName} onChange={e => setEditingName(e.target.value)} style={styles.inputSmall}/>
        <button onClick={saveName} style={styles.smallBtn}>Save</button>
      </div>

      <div style={styles.detailsRow}>
        <label style={styles.label}>Grade:</label>
        <select value={editingGrade} onChange={saveGrade} style={styles.inputSmall}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
        </select>
      </div>

      <div style={{marginTop:12}}>
        <h4>Subjects</h4>
        <ul>
          {student.subjects.map((sub, idx) => (
            <li key={idx} style={styles.subjectItem}>
              {sub}
              <button onClick={() => removeSubject(idx)} style={styles.smallBtnDanger}>Remove</button>
            </li>
          ))}
          {student.subjects.length === 0 && <div style={styles.smallText}>No subjects yet.</div>}
        </ul>

        <div style={{marginTop:8}}>
          <input
            placeholder="New subject"
            value={newSubject}
            onChange={e => setNewSubject(e.target.value)}
            style={styles.input}
          />
          <button onClick={addSubject} style={styles.button}>Add Subject</button>
        </div>
      </div>

      <div style={{marginTop: 18}}>
        <button onClick={onDelete} style={styles.buttonDanger}>Delete Student</button>
      </div>
    </div>
  );
}

/* Simple inline styles to keep the example compact */
const styles = {
  app: {
    fontFamily: "system-ui, Arial",
    padding: 20,
    maxWidth: 1000,
    margin: "0 auto"
  },
  container: {
    display: "flex",
    gap: 20
  },
  left: {
    width: 380,
    border: "1px solid #ddd",
    padding: 12,
    borderRadius: 8
  },
  right: {
    flex: 1,
    border: "1px solid #ddd",
    padding: 12,
    borderRadius: 8
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 12
  },
  input: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  inputSmall: {
    padding: 6,
    borderRadius: 6,
    border: "1px solid #ccc",
    marginRight: 8
  },
  button: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    marginTop: 6
  },
  buttonDanger: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer"
  },
  smallBtn: {
    padding: "6px 8px",
    borderRadius: 6,
    border: "none",
    background: "#6b7280",
    color: "white",
    cursor: "pointer",
    marginLeft: 6
  },
  smallBtnDanger: {
    padding: "6px 8px",
    borderRadius: 6,
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    marginLeft: 6
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: 8
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    borderBottom: "1px solid #eee"
  },
  listButtons: {
    display: "flex",
    gap: 6
  },
  detailsRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8
  },
  label: {
    width: 70,
    fontWeight: 600
  },
  placeholder: {
    color: "#666",
    padding: 20
  },
  subjectItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  smallText: {
    fontSize: 13,
    color: "#555"
  }
};

export default Std;
