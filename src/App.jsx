import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function App() {

  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const inputRef = useRef(null);

  // Load saved tasks
  useEffect(() => {

    if (window.api?.loadTasks) {
      window.api.loadTasks().then((savedTasks) => {
        setTasks(savedTasks || []);
      });
    }

  }, []);

  // Add task
  const addTask = () => {

    if (!task.trim()) return;

    const newTasks = [...tasks, { text: task, priority }];

    setTasks(newTasks);

    window.api?.saveTasks(newTasks);

    // desktop notification
    window.api?.notifyTaskAdded(task);

    setTask("");
    setPriority("Medium");

    inputRef.current.focus();
  };

  // Drag reorder
  const handleDragEnd = (result) => {

    if (!result.destination) return;

    const items = Array.from(tasks);

    const [reordered] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reordered);

    setTasks(items);

    window.api?.saveTasks(items);
  };

  // Delete task
  const deleteTask = (index) => {

    const newTasks = tasks.filter((_, i) => i !== index);

    setTasks(newTasks);

    window.api?.saveTasks(newTasks);
  };

  // Start editing
  const startEdit = (index) => {
    setEditIndex(index);
  };

  // Save edited task
  const saveEdit = (index, value) => {

    const newTasks = [...tasks];

    newTasks[index].text = value;

    setTasks(newTasks);

    setEditIndex(null);

    window.api?.saveTasks(newTasks);
  };

  const priorityColor = (p) => {
    if (p === "High") return "#ef4444";
    if (p === "Medium") return "#f59e0b";
    return "#22c55e";
  };

  return (

    <div
      style={{
        padding: 40,
        fontFamily: "Arial",
        textAlign: "center",
        background: "#0f172a",
        minHeight: "100vh",
        color: "white"
      }}
    >

      <h1>TaskDesk</h1>

      {/* Input */}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
        style={{ marginBottom: 20 }}
      >

        <input
          ref={inputRef}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
          style={{
            padding: 8,
            marginRight: 10,
            borderRadius: 4
          }}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ marginRight: 10, padding: 6 }}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button
          type="submit"
          style={{
            padding: "8px 14px",
            cursor: "pointer"
          }}
        >
          Add
        </button>

      </form>

      {/* Drag and Drop List */}

      <DragDropContext onDragEnd={handleDragEnd}>

        <Droppable droppableId="tasks">

          {(provided) => (

            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ listStyle: "none", padding: 0 }}
            >

              {tasks.map((t, i) => (

                <Draggable
                  key={i}
                  draggableId={String(i)}
                  index={i}
                >

                  {(provided) => (

                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        marginBottom: 12,
                        fontSize: 18,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 10,
                        ...provided.draggableProps.style
                      }}
                    >

                      {/* Priority Dot */}

                      <span
                        style={{
                          width: 12,
                          height: 12,
                          background: priorityColor(t.priority),
                          borderRadius: "50%"
                        }}
                      ></span>

                      {/* Editable Task */}

                      {editIndex === i ? (

                        <input
                          defaultValue={t.text}
                          autoFocus
                          onKeyDown={(e) => {

                            if (e.key === "Enter") {
                              saveEdit(i, e.target.value);
                            }

                          }}
                        />

                      ) : (

                        <span onDoubleClick={() => startEdit(i)}>
                          {t.text} ({t.priority})
                        </span>

                      )}

                      {/* Delete */}

                      <button
                        onClick={() => deleteTask(i)}
                        style={{
                          background: "red",
                          color: "white",
                          border: "none",
                          padding: "4px 8px",
                          cursor: "pointer",
                          borderRadius: 4
                        }}
                      >
                        ❌
                      </button>

                    </li>

                  )}

                </Draggable>

              ))}

              {provided.placeholder}

            </ul>

          )}

        </Droppable>

      </DragDropContext>

    </div>

  );
}

export default App;