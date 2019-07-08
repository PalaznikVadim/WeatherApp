import React from "react"

const Form=(props)=>(
    <form onSubmit={props.weatherMethod}>
        <input
			name="weatherApi"
			type="radio"
			value="option1"
			checked={props.option == 'option1'}
			onChange={props.handleRadioChange}
		/>
		<span>openweathermap.org  </span>
		<input
			name="weatherApi"
			type="radio"
			value="option2"
			checked={props.option == 'option2'}//логическая проверка свойства option
			onChange={props.handleRadioChange}
		/>
		<span>weatherbit.io</span>
        <input type="text" name="city" placeholder="Город" defaultValue={props.city}/>
        <button>Получить погоду</button>
    </form>
)

export default Form;