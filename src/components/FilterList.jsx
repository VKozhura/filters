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
	const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		const getBrands = () => {
			const config = {
				method: "get",
				url: "/api/brands",
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
				url: `/api/carmodels?brand_id=${brandId}`,
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
				url: `/api/generations?carmodel_id=${value}`,
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
				url: `/api/vehicles?carmodel_generation_id=${generationId}&engine_id=${value}`,
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

					vehicleData = {
						name: vehicle.name,
						formfactorId: vehicle.formfactor.id,
						polarityId: vehicle.polarity.id,
					};
					setVehicle(vehicleData);
					// console.log(vehicleData);
				} else {
					setVehicle(null);
					vehicleData = {
						name: null,
						formfactorId: null,
						polarityId: null,
					};
					// console.log(vehicleData);
				}
			});
		};

		getVehicle();
		setEngineId(value);
	};

	const onPutData = (vehicle) => () => {
		setLoading(true);
		// console.log(vehicle);
		const token = document.getElementsByTagName("meta")["csrf-token"].content;
		const getBrands = () => {
			const config = {
				method: "post",
				url: "https://sevsnab.ru/api/putVehicleToSession",
				headers: {
					_token: token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				data: JSON.stringify({
					...vehicle,
				}),
			};
			axios(config).then((response) => {
				window.location.replace("https://sevsnab.ru/categories/1");
				setLoading(false);
				// console.log(response.data.data);
			});
		};
		getBrands();
	};

	return (
		<div className="block-finder__form">
			<Select
				selectedValue={brandId}
				value={"Марка"}
				options={brands}
				onSelectChange={onBrandChange}
			/>
			<Select
				selectedValue={modelId}
				value={"Модель"}
				options={models}
				onSelectChange={onModelChange}
			/>
			<Select
				selectedValue={generationId}
				value={"Поколение"}
				options={generations}
				onSelectChange={onGenerationChange}
			/>
			<Select
				selectedValue={engineId}
				value={"Двигатель"}
				options={engines}
				onSelectChange={onEngineChange}
			/>
			<button
				className="block-finder__form-control block-finder__form-control--button"
				onClick={onPutData(vehicle)}
				disabled={!engineId}
			>
				{loading ? "Подбираем..." : "Подобрать"}
			</button>
		</div>
	);
};

export default Filter;
