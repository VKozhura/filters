import React from "react";
import axios from "axios";
import Select from "./Select";

const Filter = () => {
	const [brands, setBrands] = React.useState([]);
	const [brandId, setBrandId] = React.useState();
	const [models, setModels] = React.useState([]);
	const [modelId, setModelId] = React.useState();
	const [generations, setGenerations] = React.useState([]);
	const [generationId, setGenerationId] = React.useState();
	const [engines, setEngines] = React.useState([]);
	const [engineId, setEngineId] = React.useState();
	const [vehicle, setVehicle] = React.useState();

	React.useEffect(() => {
		const getBrands = () => {
			const config = {
				method: "get",
				url: "https://sevsnab.ru/api/brands",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			};
			axios(config).then((response) => {
				setBrands(response.data.data);
			});
		};
		getBrands();
	}, []);

	const onBrandChange = (e) => {
		const value = Number(e.target.value);
		setBrandId(value);
		setGenerations([]);
		setEngines([]);
		setVehicle(null);
		setModelId();
		setGenerationId();
		setEngineId();
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
		const value = Number(e.target.value);
		setModelId(value);
		setEngines([]);
		setGenerationId();
		setEngineId();
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
		const value = Number(e.target.value);
		setGenerationId(value);
		setEngineId();
		const engines = generations.find((generation) => generation.id === value).engines;
		setEngines(engines);
	};

	const onEngineChange = (e) => {
		const value = Number(e.target.value);
		setEngineId(value);
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
				const vehicle = response.data.data.reduce((vehicleMap, vehicle) => {
					return {
						...vehicleMap,
						...vehicle,
					};
				}, {});
				console.log(vehicle);
				setVehicle(vehicle.name);
				console.log(vehicle.name, vehicle.formfactor.id, vehicle.polarity.id);
			});
		};

		getVehicle();
	}, [generationId, engineId]);

	return (
		<div>
			<Select
				selectedValue={brandId}
				value={"Brand"}
				options={brands}
				onSelectChange={onBrandChange}
			/>
			<Select
				selectedValue={modelId}
				value={"Model"}
				options={models}
				onSelectChange={onModelChange}
			/>
			<Select
				selectedValue={generationId}
				value={"Generation"}
				options={generations}
				onSelectChange={onGenerationChange}
			/>
			<Select
				selectedValue={engineId}
				value={"Engine"}
				options={engines}
				onSelectChange={onEngineChange}
			/>

			<p>{vehicle}</p>
		</div>
	);
};

export default Filter;
