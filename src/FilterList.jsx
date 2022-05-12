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
	const [engines, setEngines] = React.useState([]);
	const [engineId, setEngineId] = React.useState();
	const [vehicle, setVehicle] = React.useState(null);

	React.useEffect(() => {
		fetch("https://sevsnab.ru/api/brands")
			.then((response) => response.json())
			.then((data) => setBrands(data.data));
	}, []);

	const onBrandChange = (e) => {
		const value = e.target.value;
		setBrandId(Number(value));
		setVehicle(null);
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
		setGenerations([]);
		setEngines([]);
	}, [brandId]);

	const onModelChange = (e) => {
		const value = e.target.value;
		setModelId(Number(value));
		setGenerations([]);
		setEngines([]);
		setVehicle(null);
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
		setGenerationId(Number(value));
		setEngines(generations.find((generation) => generation.id === Number(value)).engines);
	};

	const onEngineChange = (e) => {
		const value = e.target.value;
		setEngineId(Number(value));
	};

	React.useEffect(() => {
		const getVehicle = () => {
			const config = {
				method: "get",
				url: `https://sevsnab.ru/api/vehicles?carmodel_generation_id=${generationId}&engine_id=${engineId}`,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			};

			axios(config).then((response) => {
				const vehicleName = response.data.data.map((vehicle) => vehicle.name);
				setVehicle(vehicleName);
			});
		};

		getVehicle();
	}, [generationId, engineId]);

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

			<select onChange={onEngineChange} name="" id="">
				<option value="">--Select Engine--</option>
				{engines.map((engine) => (
					<option key={engine.id} value={engine.id}>
						{engine.name}
					</option>
				))}
			</select>
			<p>{vehicle}</p>
		</div>
	);
};

export default Filter;
