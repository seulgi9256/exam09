import React, { useEffect, useState } from 'react';
import TodoFooter from '../components/TodoFooter';
import TodoHeader from '../components/TodoHeader';
import TodoInput from '../components/TodoInput';
import TodoList from '../components/TodoList';

const TodoContainer = () => {
  const [todoList, setTodoList] = useState([]);
  const [input, setInput] = useState('');

  // useEffect(() => {
  //   fetch('http://localhost:9090/todos')
  //     .then((response) => response.json())
  //     .then((data) => setTodoList(data))
  //     .catch((error) => console.log(error));
  // }, []);

  useEffect(() => {
    fetch('http://localhost:9090/todos')
      .then((response) => response.json())
      .then((data) => setTodoList(Array.isArray(data.todoList) ? data.todoList : []))
      .catch((error) => console.error('Fetch error:', error));
  }, []);
  
  
  
  const onChange = (e) => {
    setInput(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
  
    if (input === '') {
      setInput('제목없음');
    }
  
    // POST request
    const data = {
      content: input,
      status: 0,
    };
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  
    try {
      const response = await fetch('http://localhost:9090/todos/insert', init);
      const newTodo = await response.json();
  
      setTodoList((updatedList) => [newTodo, ...updatedList]);
      
      // 새로운 목록을 받아오는 API 호출
      fetch('http://localhost:9090/todos')
        .then((response) => response.json())
        .then((data) => setTodoList(Array.isArray(data.todoList) ? data.todoList : []))
        .catch((error) => console.error('Fetch error:', error));
    } catch (error) {
      console.log(error);
    }
  
    setInput('');
  };
  

const onRemove = async (no) => {
  console.log('remove...');

  // DELETE 요청
  const init = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(`http://localhost:9090/todos/${no}`, init);
    console.log(response);
  } catch (error) {
    console.log(error);
  }

  setTodoList((todoList) => todoList.filter((todo) => todo.no !== no));
};

  
  
const onToggle = async (todo) => {
  console.log('toggle...');

  // PUT 요청
  const data = {
    no: todo.no,
    content: todo.content,
    status: todo.status ? 0 : 1,
  };
  const init = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`http://localhost:9090/todos/update/${todo.no}`, init);
    console.log(response);

    // 새로운 목록을 받아오는 API 호출
    fetch('http://localhost:9090/todos')
    .then((response) => response.json())
    .then((data) => setTodoList(Array.isArray(data.todoList) ? data.todoList : []))
    .catch((error) => console.error('Fetch error:', error));

  } catch (error) {
    console.log(error);
  }

  setTodoList((todoList) => {
    return todoList.map((item) => {
      return item.no === todo.no ? { ...item, status: !item.status } : item;
    }).sort((a, b) => {
      return a.status - b.status === 0 ? b.no - a.no : a.status - b.status;
    })
    ;
  }); 
};


const onCompleteAll = async () => {
  console.log('전체완료...');
  const data = { status : 0 }

  // PUT 요청
  const init = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({data}),
  };

  try {
    const response = await fetch('http://localhost:9090/todos/updateAll', init);
    console.log(response);

    // 새로운 목록을 받아오는 API 호출
    fetch('http://localhost:9090/todos')
    .then((response) => response.json())
    .then((data) => setTodoList(Array.isArray(data.todoList) ? data.todoList : []))
    .catch((error) => console.error('Fetch error:', error));

    if (!response.ok) {
      console.error(`Failed to complete all. Status: ${response.status}`);
    }
  } catch (error) {
    console.log(error);
  }

  setTodoList((todoList) => {
    return todoList.map((item) => {
      return { ...item, status: true };
    }).sort((a, b) => {
      return a.status - b.status === 0 ? b.no - a.no : a.status - b.status;
    });
  });
};

  const onRemoveAll = async () => {
    console.log('remove all...');
  
    const init = {
      method: 'DELETE',
    };
  
    try {
      const response = await fetch('http://localhost:9090/todos/delete/all', init);
      console.log(response);
      if (response.ok) {
        setTodoList([]);
      } else {
        console.error(`Failed to delete all. Status: ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='container'>
      <TodoHeader />
      <TodoInput input={input} onChange={onChange} onSubmit={onSubmit} />
      <TodoList todoList={todoList} onRemove={onRemove} onToggle={onToggle} />
      <TodoFooter onCompleteAll={onCompleteAll} onRemoveAll={onRemoveAll} />
    </div>
  );
};

export default TodoContainer;
