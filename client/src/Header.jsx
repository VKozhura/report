import React from "react";

const Header = () => {
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

    console.log(startDate);
    console.log(finishDate);


 return (
    <div>
        <input type="date" onChange={onStartChange}/>
        <input type="date" onChange={onFinishChange}/>
        <button >Сформировать</button>
    </div>
 )
}

export default Header;