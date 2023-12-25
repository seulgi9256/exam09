const express = require('express')
const Sequelize = require('sequelize')     
const Todo = require('../models/todo')          
const router = express.Router()

// 할 일 목록
router.get('/', async (req, res) => {
    console.log('할 일 목록...');
    let todoList = [];
    try {
        todoList = await Todo.findAll();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ todoList });
});



// 할 일 등록
router.get('/insert', (req, res) => {
    console.log('할 일 등록 화면...');
    res.json({ message: '할 일 등록 화면' });
});



// 👩‍💻 할 일 등록
router.post('/insert', async (req, res) => {
    console.log('할 일 등록...');
    const { content, status } = req.body;
  
    let result = 0;
    try {
      const newTodo = await Todo.create({
        content,
        status,
      });
      no = newTodo.no;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  
    console.log(`등록 result : ${result}`);
    res.json({ result, no });
  });


// 👩‍💻 할 일 수정 페이지
router.get('/update/:no', async (req, res) => {
    console.log('할 일 수정 화면...');
    console.log(`no : ${req.params.no}`);
    let no = req.params.no
    let todo = await Todo.findByPk(no)
    // res.render('todos/update', { todo, no });
    res.json({ todo, no })
});




// 선택 완료
router.put('/update/:no', async (req, res) => {
  console.log('할 일 선택 완료...');
  const { no, content, status } = req.body;

  let result = 0;
  try {
    result = await Todo.update({
      content: content,
      status: status,
      upd_date: Sequelize.literal('now()')
    }, {
      where: { no: no }
    });
  } catch (error) {
    console.log(error);
  }
  console.log(`수정 result : ${result}`);
  res.json({ no, result });
});

// 전체 선택 완료
router.put('/updateAll', async (req, res) => {
  console.log('모든 할 일 완료...');

  try {
    // 전체 할 일을 찾아 일괄적으로 업데이트합니다.
    const result = await Todo.update(
      { status: 1, upd_date: Sequelize.literal('now()') },
      { where: { status: 0 } }
    );

    console.log(`수정 result : ${result}`);
    
    // 완료 후에 목록을 다시 불러옴
    // const updatedListResponse = await fetch('http://localhost:9090/todos');
    // const updatedListData = await updatedListResponse.json();
    // setTodoList(Array.isArray(updatedListData.todoList) ? updatedListData.todoList : []);

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// 👩‍💻 할 일 삭제
router.delete('/:no', async (req, res) => {
    console.log('할 일 삭제...');
    const no = req.params.no;
  
    let result = 0;
    try {
      result = await Todo.destroy({
        where: { no: no },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(`삭제 result : ${result}`);
  
    res.json({ result, no });
  });
  
// 👩‍💻 할 일 전체 삭제
router.delete('/delete/all', async (req, res) => {
    console.log('모든 할 일 삭제...');
  
    try {
      // 전체 할 일 삭제 로직 구현
      await Todo.destroy({ where: {} });
  
      res.status(204).send(); // 성공적으로 삭제되었음을 나타내는 상태 코드 204 전송
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// 👩‍💻 할 일 읽기
// 요청 경로에 파라미터 매핑 방법 ➡ '/:파라미터명'
router.get('/read/:no', async (req, res) => {
    console.log('할 일 읽기 화면...');
    console.log(`no : ${req.params.no}`);
    let no = req.params.no
    let todo = await Todo.findByPk(no)
    console.log(todo);
    // res.render('todos/read', {todo, no})
    res.json({ todo, no })
})


module.exports = router;