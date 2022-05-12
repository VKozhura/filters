import React from "react";

const Select = ({ options, onSelectChange, value }) => {
	console.log(options);
	return (
		<select onChange={onSelectChange} name="" id="">
			<option value={value}>--Select {value}--</option>
			{options.map((option) => (
				<option key={option.id} value={option.id}>
					{option.name ? option.name : option.years}
				</option>
			))}
		</select>
	);
};

export default Select;
