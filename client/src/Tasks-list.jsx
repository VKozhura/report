import React from "react";
import axios from "axios";

import { dateConvert } from "./functions";

const TasksList = () => {
	const [tasks, setTasks] = React.useState();
	const [startDate, setStartDate] = React.useState(null);
	const [finishDate, setFinishDate] = React.useState(null);

	const onStartChange = (e) => {
		const value = e.target.value;
		setStartDate(value);
	};
	const onFinishChange = (e) => {
		const value = e.target.value;
		setFinishDate(value);
	};

	// console.log(Date.parse(new Date(startDate)));
	// console.log(Date.parse(new Date(finishDate)));

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


	const onTasks = () => {
	
		const config = {
			method: "get",
			// url: `http://localhost:5000/api?date1=${(Date.parse(new Date (startDate)))/1000}&date2=${(Date.parse(new Date (finishDate)))/1000}`,
			url: "https://redmine.bivgroup.com/issues.json?status_id=*&include=journals",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"X-Redmine-API-Key": "c4bb0c5363355760be678f1ed6e30de09b3495d2",
                
			},
		};

		axios(config).then((response) => {
			console.log(response.data);
			setTasks(response.data.issues);
		});
	};

    console.log(tasks);
	return (
		<div>
			<input type="date" onChange={onStartChange} />
			<input type="date" onChange={onFinishChange} />
			<button onClick={onTasks}>Сформировать</button>

			{tasks ? (
				<table>
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
							<th>Закрыто</th>
							<th>Создано_Решено</th>
							<th>Интервал</th>
						</tr>
					</thead>
					<tbody>
						{tasks.map((task, index) => (
							<tr key={task.id}>
								<th>{index + 1}</th>
								<th>{task.id}</th>
								<th>{task.tracker.name}</th>
								<th>{task.subject}</th>
								<th>{task.status.name}</th>
								<th>{task.priority.name}</th>
								<th>{task.estimated_hours}</th>
								<th>{dateConvert(task.created_on)}</th>
								<th>{dateConvert(task.closed_on)}</th>
								<th></th>
								<th></th>
							</tr>
						))}
					</tbody>
				</table>
			) : null}
		</div>
	);
};

export default TasksList;
