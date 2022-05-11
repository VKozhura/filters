import React from "react";
import axios from "axios";

const getBrands = async () => {
	const response = await fetch("https://sevsnab.ru/api/brands");
	const brands = await response.json();
	return brands.data;
};

const Filter = () => {
	const [brands, setBrands] = React.useState([]);
	const [brandId, setBrandId] = React.useState();
	const [models, setModels] = React.useState([]);
	const [modelId, setModelId] = React.useState();
	const [generations, setGenerations] = React.useState([]);
	const [generationId, setGenerationId] = React.useState();

	React.useEffect(() => {
		fetch("https://sevsnab.ru/api/brands")
			.then((response) => response.json())
			.then((data) => setBrands(data.data));
	}, []);

	const onBrandChange = (e) => {
		const value = e.target.value;
		setBrandId(value);
	};

	React.useEffect(() => {
		const getModelsByBrand = () => {
			const config = {
				method: "get",
				url: `https://sevsnab.ru/api/carmodels?brand_id=${brandId}`,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			};

			axios(config).then((response) => {
				setModels(response.data.data);
			});
		};

		getModelsByBrand();
	}, [brandId]);

	const onModelChange = (e) => {
		const value = e.target.value;
		setModelId(value);
	};

	React.useEffect(() => {
		const getGenerationsByModel = () => {
			const config = {
				method: "get",
				url: `https://sevsnab.ru/api/generations?carmodel_id=${modelId}`,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			};

			axios(config).then((response) => {
				setGenerations(response.data.data);
			});
		};

		getGenerationsByModel();
	}, [modelId]);

	const onGenerationChange = (e) => {
		const value = e.target.value;
		setGenerationId(value);
	};

	console.log(generations);
	return (
		<div>
			<select onChange={onBrandChange} name="" id="">
				<option value="">--Select Brand--</option>
				{brands.map((brand) => (
					<option key={brand.id} value={brand.id}>
						{brand.name}
					</option>
				))}
			</select>

			<select onChange={onModelChange} name="" id="">
				<option value="">--Select Model--</option>
				{models.map((model) => (
					<option key={model.id} value={model.id}>
						{model.name}
					</option>
				))}
			</select>

			<select onChange={onGenerationChange} name="" id="">
				<option value="">--Select Generation--</option>
				{generations.map((generation) => (
					<option key={generation.id} value={generation.id}>
						{generation.name ? `${generation.name},${generation.years}` : generation.years}
					</option>
				))}
			</select>

			<select name="" id="">
				<option value="">--Select Engine--</option>
				{/* {generations
					.find((generation) => generation.id === generationId)
					.engines.map((engine) => (
						<option key={engine.id} value={engine.id}>
							{engine.name}
						</option>
					))} */}
			</select>
		</div>
	);
};

export default Filter;
