import React, { useRef, useState } from 'react';
import { supabase } from '../supabase-config/api';
import { v4 as uuidv4 } from 'uuid';

export const AddTodo = ({ todos, setTodos }) => {
  const todoRef = useRef();
  const [errorTxt, setError] = useState('');

  const addTodo = async () => {
    let todo = todoRef.current.value.trim();

    if (!todo.length) {
      setError('Please enter a valid todo!');
      return;
    }

    const { data, error } = await supabase.from('todos').insert({
      todo,
      id: uuidv4(),
      isComplete: false,
    });

    console.log(data);

    if (error) setError(error);

    if (!error) {
      setTodos([...todos, todo]);
      setError(null);
      todoRef.current.value = '';
    }
  };

  return (
    <div>
      {errorTxt && (
        <div className="alert">
          <p>{errorTxt}</p>
        </div>
      )}
      <label>
        Create a todo:
        <input
          ref={todoRef}
          required
          type="text"
          onKeyUp={(e) => e.key === 'Enter' && addTodo()}
          className=""
        />
      </label>
      <button onClick={addTodo} className="">
        Add
      </button>
    </div>
  );
};
