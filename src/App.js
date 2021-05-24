import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import './App.scss';
import { supabase } from './supabase-config/api';
import { Header } from './components/header';
import { AddTodo } from './components/add-todo';
import { Column } from './components/column';

export const App = () => {
  const [todos, setTodos] = useState([]);
  const [currentTodos, setCurrentTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, [todos]);

  const fetchTodos = async () => {
    let { data: todos, error } = await supabase.from('todos').select('*');

    if (error) console.log('error', error);

    const newCurrentTodos = todos
      .reverse()
      .filter(({ isComplete }) => !isComplete);
    setCurrentTodos([...newCurrentTodos]);

    const newCompletedTodos = todos.filter(({ isComplete }) => isComplete);
    setCompletedTodos([...newCompletedTodos]);
  };

  const updateTodo = async ({ id, bool }) => {
    try {
      const result = await supabase
        .from('todos')
        .update({ isComplete: !bool })
        .match({ id });
      console.log({ result });
    } catch (error) {
      console.log(error);
    }
  };

  const getList = (id) => {
    if (id === 'current-todos') {
      return currentTodos;
    }

    if (id === 'completed-todos') {
      return completedTodos;
    }
  };

  const handleDragEnd = ({ source, destination }) => {
    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    const sourceList = getList(source.droppableId);

    // Creating a copy of item before removing it from state
    const itemCopy = { ...sourceList[source.index] };

    console.log({ itemCopy });

    if (source.droppableId === 'current-todos') {
      setCurrentTodos((prev) => {
        prev = [...prev];
        prev.splice(source.index, 1);
        return prev;
      });
    }

    if (source.droppableId === 'completed-todos') {
      setCompletedTodos((prev) => {
        prev = [...prev];
        prev.splice(source.index, 1);
        return prev;
      });
    }

    if (destination.droppableId === 'current-todos') {
      setCurrentTodos((prev) => {
        prev = [...prev];
        prev.splice(destination.index, 0, itemCopy);
        return prev;
      });
    }

    if (destination.droppableId === 'completed-todos') {
      setCompletedTodos((prev) => {
        prev = [...prev];
        prev.splice(destination.index, 0, itemCopy);
        return prev;
      });
    }

    updateTodo({
      id: itemCopy.id,
      bool: itemCopy.isComplete,
    });
  };

  return (
    <div id="App">
      <Header />
      <AddTodo todos={todos} setTodos={setTodos} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="column-container">
          <Column
            todos={todos}
            setTodos={setTodos}
            columnTitle={'Todos'}
            droppableId={'current-todos'}
            todosArray={currentTodos}
          />
          <Column
            todos={todos}
            setTodos={setTodos}
            columnTitle={'Completed'}
            droppableId={'completed-todos'}
            todosArray={completedTodos}
          />
        </div>
      </DragDropContext>
    </div>
  );
};
