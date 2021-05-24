import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { supabase } from '../supabase-config/api';

export const TodoItem = ({ todos, setTodos, el, index }) => {
  const deleteTodo = async (id) => {
    try {
      await supabase.from('todos').delete().eq('id', id);
      setTodos(todos.filter((x) => x.id !== id));
      console.log(todos);
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <React.Fragment>
      <Draggable key={el.id} index={index} draggableId={el.id}>
        {(provided) => {
          return (
            <div
              className={'todo-item'}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {el.todo}
              <button
                type="button"
                className="btn-clear"
                onClick={() => deleteTodo(el.id)}
              >
                Delete
              </button>
            </div>
          );
        }}
      </Draggable>
    </React.Fragment>
  );
};
