import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { TodoItem } from './todo.-item';

export const Column = ({
  todos,
  setTodos,
  columnTitle,
  droppableId,
  todosArray,
}) => {
  return (
    <div className="column">
      <h2 className={'column-title'}>{columnTitle}</h2>
      <Droppable droppableId={droppableId}>
        {(provided) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={'droppable-col'}
            >
              {todosArray.map((el, index) => {
                return (
                  <TodoItem
                    todos={todos}
                    setTodos={setTodos}
                    el={el}
                    index={index}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};
