import React from "react";

const Select = ({ options, onSelectChange, value, selectedValue }) => {
	const currentValue = selectedValue ?? "default";
	return (
		<div className="block-finder__form-control block-finder__form-control--select">
			<select value={currentValue} onChange={onSelectChange}>
				<option value={"default"}>{value}</option>
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
		</div>
	);
};

export default Select;
