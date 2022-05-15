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
		const brandId = Number(e.target.value);
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
		setBrandId(brandId);
		setGenerations([]);
		setEngines([]);
		setVehicle(null);
		setModelId();
		setGenerationId();
		setEngineId();
	};

	const onModelChange = (e) => {
		const value = Number(e.target.value);
		const getGenerationsByModel = () => {
			const config = {
				method: "get",
				url: `https://sevsnab.ru/api/generations?carmodel_id=${value}`,
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
		setModelId(value);
		setEngines([]);
		setGenerationId();
		setEngineId();
		setVehicle(null);
	};

	const onGenerationChange = (e) => {
		const value = Number(e.target.value);
		setGenerationId(value);
		const engines = generations.find((generation) => generation.id === value).engines;
		setEngines(engines);
		setEngineId();
	};

	const onEngineChange = (e) => {
		const value = Number(e.target.value);
		const getVehicle = () => {
			const config = {
				method: "get",
				url: `https://sevsnab.ru/api/vehicles?carmodel_generation_id=${generationId}&engine_id=${value}`,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			};

			axios(config).then((response) => {
				let vehicleData;
				if (response.data.data.length !== 0) {
					const vehicle = response.data.data.reduce((vehicleMap, vehicle) => {
						return {
							...vehicleMap,
							...vehicle,
						};
					}, {});
					setVehicle(vehicle.name);
					vehicleData = {
						name: vehicle.name,
						formfactorId: vehicle.formfactor.id,
						polarityId: vehicle.polarity.id,
					};
					console.log(vehicleData);
				} else {
					setVehicle(null);
					vehicleData = {
						name: null,
						formfactorId: null,
						polarityId: null,
					};
					console.log(vehicleData);
				}
			});
		};

		getVehicle();
		setEngineId(value);
	};

	const onPutData = (e) => {
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
				console.log(response.data.data);
			});
		};
		getBrands();
	};

	return (
		<div className="block-finder__form">
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
			<button
				className="block-finder__form-control block-finder__form-control--button"
				onClick={onPutData}
			>
				Search
			</button>
			<p>{vehicle}</p>
		</div>
	);
};

export default Filter;
