import React from "react";
import axios from 'axios';
import { Buffer } from 'node:buffer';

import { dateConvert } from "./functions";

const TasksList = () => {
    const [tasks, setTasks] = React.useState();
    const [startDate, setStartDate] = React.useState(null)
    const [finishDate, setFinishDate] = React.useState(null)

    const onStartChange = (e) => {
        const value = e.target.value;
        setStartDate(value);
    }
    const onFinishChange = (e) => {
        const value = e.target.value;
        setFinishDate(value);
    }

    console.log(Date.parse(new Date (startDate)));
    console.log(Date.parse(new Date (finishDate)));
    

    // React.useEffect(() => {
	// 	const getTasks = () => {
	// 		const config = {
	// 			method: "get",
	// 			url: "http://localhost:5000/api",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Accept: "application/json",
	// 			},
	// 		};
	// 		axios(config).then((response) => {
    //             console.log(response.data)
	// 			setTasks(response.data.tasks);
                
	// 		});
	// 	};
	// 	getTasks();
  
	// }, []);
 
    console.log(tasks)

    const onTasks = async () => {
        const userName = 'vkozhura';
        const password = 'jrsoVsyYXm';
        const token = `${userName}:${password}`;
        const encodedToken = Buffer.from(token).toString('base64');
        const config = {
            method: "get",
            // url: `http://localhost:5000/api?date1=${(Date.parse(new Date (startDate)))/1000}&date2=${(Date.parse(new Date (finishDate)))/1000}`,
            url: 'https://redmine.bivgroup.com/issues.json',
            headers: {
                'Authorization': 'Basic '+ encodedToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                // 'X-Redmine-API-Key': 'c4bb0c5363355760be678f1ed6e30de09b3495d2',
                'Access-Control-Allow-Origin': "http://localhost:3000",
                // 'Access-Control-Allow-Credentials': true
              
            },
        };
        const res = await axios(config)
        console.log(res.data)
        // axios(config).then((response) => {
        //     console.log(response.data)
        //     setTasks(response.data.tasks);
            
        // });
    }

    return (
        <div>
        <input type="date" onChange={onStartChange}/>
        <input type="date" onChange={onFinishChange}/>
        <button onClick={onTasks}>Сформировать</button>

        {tasks ? (<table>
        <thead>
            <tr>
                <th>№ п/п</th>
                <th>Задача</th>
                <th>Трекер</th>
                <th>Тема</th>
                <th>Статус</th>
                <th>Приоритет</th>
                <th>Трудозатраты (в ч.)</th>
                <th>Создано</th>
                <th>Обновлено</th>
                <th>Закрыто</th>
                <th>Создано_Решено</th>
                <th>Интервал</th>
            </tr>
        </thead>
        <tbody>
            {tasks.map((task, index) => (
                <tr key={task.tasknumber}>
                    <th>{index + 1}</th>
                    <th>{task.tasknumber}</th>
                    <th>{task.tracker}</th>
                    <th>{task.theme}</th>
                    <th>{task.status}</th>
                    <th>{task.priority}</th>
                    <th>{task.labour}</th>
                    <th>{dateConvert(task.createdate)}</th>
                    <th>{dateConvert(task.closeddate)}</th>
                    <th>{dateConvert(task.updatedate)}</th>
                    <th>{(task.createclosed/60).toFixed(2)}</th>
                    <th>{(task.interv/60).toFixed(2)}</th>
                </tr>
            ))}
        </tbody>
           
       </table>) : null }
            
       
       </div>
    )
}




export default TasksList;