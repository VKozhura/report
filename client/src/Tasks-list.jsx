import React from "react";
import axios from 'axios';

const TasksList = () => {
    const [tasks, setTasks] = React.useState([]);
    

    React.useEffect(() => {
		const getTasks = () => {
			const config = {
				method: "get",
				url: "http://localhost:5000/api",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			};
			axios(config).then((response) => {
                console.log(response.data)
				setTasks(response.data.tasks);
                
			});
		};
		getTasks();
  
	}, []);
 
    console.log(tasks)

    return (
       <table>
        <thead>
            <tr>
                <th>Задача</th>
                <th>Трекер</th>
                <th>Тема</th>
                <th>Статус</th>
                <th>Приоритет</th>
                <th>Трудозатраты</th>
                <th>Создано</th>
                <th>Обновлено</th>
                <th>Закрыто</th>
                <th>Создано_Решено</th>
            </tr>
        </thead>
        <tbody>
            {tasks.map(task => (
                <tr key={task.tasknumber}>
                    <th>{task.tasknumber}</th>
                    <th>{task.tracker}</th>
                    <th>{task.theme}</th>
                    <th>{task.status}</th>
                    <th>{task.priority}</th>
                    <th>{task.labour}</th>
                    <th>{task.createdate}</th>
                    <th>Обновлено</th>
                    <th>Закрыто</th>
                    <th>Создано_Решено</th>
                </tr>
            ))}
        </tbody>
           
       </table> 
    )
}

export default TasksList;