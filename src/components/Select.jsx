import React from "react";

const Select = ({ options, onSelectChange, value, selectedValue }) => {
	const currentValue = selectedValue ?? "default";
	return (
		<select value={currentValue} onChange={onSelectChange}>
			<option value={"default"}>--Select {value}--</option>
			{options.map((option) => (
				<option key={option.id} value={option.id}>
					{option.name && option.years
						? `${option.name}, ${option.years}`
						: option.name
						? option.name
						: option.years}
				</option>
			))}
		</select>
	);
};

export default Select;
