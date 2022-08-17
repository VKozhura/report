import React from "react";
import axios from "axios";

import { dateConvert } from "./functions";


const onScrollTasks = (event) => {

}

const TasksList = () => {
	const [tasks, setTasks] = React.useState({ data: [], portion: 0, page: 0, totalCount: 0});
	const [tasksCreatedBefore, setTasksCreatedBefore] = React.useState({ data: [], portion: 0, page: 0, totalCount: 0});
	const [startDate, setStartDate] = React.useState(null);
	const [start2Date, setStart2Date] = React.useState(null);
	const [startBeforeDate, setStartBeforeDate] = React.useState(null);
	const portion = 50;
	const totalPages = Math.ceil(tasks.totalCount / portion);


	const onStartChange = (e) => {
		const value = e.target.value;
		setStartDate(value);
	};
	const onFinishChange = (e) => {
		const value = e.target.value;
		setStart2Date(value);
	};
	const onStartBefore = (e) => {
		const value = e.target.value;
		setStartBeforeDate(value);
	};
	

	const fetchTasks = () => {
		console.log(tasks.page);
		const config1 = {
			method: "get",
			url: `https://redmine.bivgroup.com/issues.json?status_id=*&offset=${tasks.portion}&limit=50&created_on=%3E%3C${startDate}|${start2Date}`,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"X-Redmine-API-Key": "c4bb0c5363355760be678f1ed6e30de09b3495d2",
			},
		};

		const config2 = {
			method: "get",
			url: `https://redmine.bivgroup.com/issues.json?status_id=*&offset=0&limit=50&created_on=%3C%3D${startDate}&status_id=open`,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"X-Redmine-API-Key": "c4bb0c5363355760be678f1ed6e30de09b3495d2",
			},
		};

		Promise.all([axios(config1), axios(config2)]).then(response => {
			console.log('получение данных');
			console.log(response);
			let issuesArr = []
			let totalCount = 0
			let page = 
			response.forEach(item => {
				issuesArr = [...issuesArr, ...item.data.issues]
				totalCount = totalCount + item.data.total_count
				console.log(issuesArr)
				
			})
			setTasks({ 
				data: [...tasks.data, ...issuesArr],
				// page: tasks.page + 1,
				totalCount: totalCount
			})
			setTasks(tasks => ({...tasks, portion: issuesArr.length + 1}))
		})

		console.log(tasks);
	
		// axios(config1).then((response) => {
		// 	console.log('получение данных');
		// 	console.log(response.data.total_count);
		// 	setTasks({ 
		// 		data: [...tasks.data, ...response.data.issues],
		// 		page: tasks.page + 1,
		// 		totalCount: response.data.total_count
		// 	})
		// 	setTasks(tasks => ({...tasks, portion: tasks.data.length + 1}))
		// });

		// axios(config2).then((response) => {
		// 	console.log('получение данных 2');
		// 	console.log(response.data.total_count);
		// 	setTasksCreatedBefore({ 
		// 		data: [...tasksCreatedBefore.data, ...response.data.issues],
		// 		page: tasksCreatedBefore.page,
				
		// 		totalCount: response.data.total_count
		// 	})
			
		// });
	}


	const onTasks = () => {
		fetchTasks()
	};


	const onAddTasks = () => {
		const config = {
			method: "get",
			// url: `http://localhost:5000/api?date1=${(Date.parse(new Date (startDate)))/1000}&date2=${(Date.parse(new Date (finishDate)))/1000}`,
			url: `https://redmine.bivgroup.com/issues.json?status_id=*&created_on=%3C%3D${startBeforeDate}&closed_on=%3E%3C${startDate}|${start2Date}`,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"X-Redmine-API-Key": "c4bb0c5363355760be678f1ed6e30de09b3495d2",
                
			},
		};

		axios(config).then((response) => {
			console.log(response.data);

			const totalTasks = [...tasks, ...response.data.issues ]
			setTasks(totalTasks);
			
		});
	}

	const lastItem = React.createRef();
  	const observerLoader = React.useRef();

  	const actionInSight = (entries) => {
		if (entries[0].isIntersecting && tasks.page <= totalPages) {
			fetchTasks();
		}
  	};

  	//вешаем на последний элемент наблюдателя, когда последний элемент меняется
  	React.useEffect(() => {
    	if (observerLoader.current) observerLoader.current.disconnect();

    	observerLoader.current = new IntersectionObserver(actionInSight);
    	if (lastItem.current) observerLoader.current.observe(lastItem.current);
  	}, [lastItem]);

    console.log(tasks);
	return (
		<div >
			<input type="date" onChange={onStartChange} />
			<input type="date" onChange={onFinishChange} />
			<button onClick={onTasks}>Сформировать</button>

			{/* <input type="date" onChange={onStartBefore} /> */}
			{/* <input type="date" onChange={onFinishInPeriod} /> */}
			{/* <button onClick={onAddTasks}>Добавить</button> */}

			{tasks.data.length !== 0 ? (
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
						{tasks.data.map((task, index) => {
							if (index + 1 === tasks.data.length) {
								return (<tr key={task.id} ref={lastItem}>
									<th>{index + 1}</th>
									<th>{task.id}</th>
									<th>{task.tracker.name}</th>
									<th>{task.subject}</th>
									<th>{task.status.name}</th>
									<th>{task.priority.name}</th>
									<th>{task.estimated_hours}</th>
									<th>{dateConvert(task.created_on)}</th>
									<th>{task.closed_on !== null ? dateConvert(task.closed_on) : 'не закрыта'}</th>
									<th></th>
									<th></th>
								</tr>)
							}
							return (<tr key={task.id}>
								<th>{index + 1}</th>
								<th>{task.id}</th>
								<th>{task.tracker.name}</th>
								<th>{task.subject}</th>
								<th>{task.status.name}</th>
								<th>{task.priority.name}</th>
								<th>{task.estimated_hours}</th>
								<th>{dateConvert(task.created_on)}</th>
								<th>{task.closed_on !== null ? dateConvert(task.closed_on) : 'не закрыта'}</th>
								<th></th>
								<th></th>
							</tr>)
						})}
					</tbody>
				</table>
			) : null}
		</div>
	);
};

export default TasksList;
