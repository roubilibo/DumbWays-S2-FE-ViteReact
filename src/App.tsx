/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";
import PropTypes from "prop-types";
import "./assets/App.css";

interface AppState {
	provinces: any[];
	selectedProvinces: string | null;
	regencies: any[];
	selectedRegencies: string | null;
	subdistricts: any[];
	selectedSubdistricts: string | null;
	ward: any[];
}

// eslint-disable-next-line @typescript-eslint/ban-types
class App extends React.Component<{}, AppState> {
	constructor(props: object | Readonly<object>) {
		super(props);
		this.state = {
			provinces: [],
			selectedProvinces: null,
			regencies: [],
			selectedRegencies: null,
			subdistricts: [],
			selectedSubdistricts: null,
			ward: [],
		};
	}

	async componentDidMount() {
		await this.getProvince();
	}

	async getProvince() {
		try {
			const resProvince = await fetch(
				"https://raw.githubusercontent.com/vionaaindah/GeoID-API/main/provinces.json"
			);
			const dataProvince = await resProvince.json();

			const resRegencies = await fetch(
				"https://raw.githubusercontent.com/vionaaindah/GeoID-API/main/regencies.json"
			);
			const dataRegencies = await resRegencies.json();

			const resSubdisctricts = await fetch(
				"https://raw.githubusercontent.com/vionaaindah/GeoID-API/main/districts.json"
			);
			const dataSubdisricts = await resSubdisctricts.json();

			const resWards = await fetch(
				"https://raw.githubusercontent.com/vionaaindah/GeoID-API/main/villages.json"
			);
			const dataWards = await resWards.json();

			this.setState({
				provinces: dataProvince,
				regencies: dataRegencies,
				subdistricts: dataSubdisricts,
				ward: dataWards,
			});
		} catch (error) {
			console.error(error, "error error");
		}
	}

	render() {
		const {
			provinces,
			selectedProvinces,
			regencies,
			selectedRegencies,
			subdistricts,
			selectedSubdistricts,
			ward,
		} = this.state;

		return (
			<div className="main">
				<Place
					option={"Select a province"}
					content={provinces}
					handleSelect={(value) => this.setState({ selectedProvinces: value })}>
					Provinces
				</Place>
				<Place
					option={"Select a regency"}
					content={regencies.filter(
						(regency) => regency.province_id === selectedProvinces
					)}
					handleSelect={(value) => this.setState({ selectedRegencies: value })}>
					Regencies
				</Place>
				<Place
					option={"Select a subdistrict"}
					content={subdistricts.filter(
						(subdisctict) => subdisctict.regency_id === selectedRegencies
					)}
					handleSelect={(value) =>
						this.setState({ selectedSubdistricts: value })
					}>
					Subdistricts
				</Place>
				<Place
					option={"Select a ward"}
					content={ward.filter(
						(wards) => wards.district_id === selectedSubdistricts
					)}>
					Wards
				</Place>
			</div>
		);
	}
}

interface PlaceProps {
	children: React.ReactNode;
	option: string;
	content?: any[];
	handleSelect?: (value: string) => void;
}
class Place extends Component<PlaceProps> {
	static propTypes = {
		children: PropTypes.node.isRequired,
		option: PropTypes.string.isRequired,
		content: PropTypes.array,
		handleSelect: PropTypes.func,
	};
	render() {
		const { children, option, content, handleSelect } = this.props;

		return (
			<div className="container">
				<span>{children}</span>
				<select
					placeholder="select"
					onChange={(e) => handleSelect && handleSelect(e.target.value)}>
					<option value="" hidden>
						{option}
					</option>
					{content &&
						content.map((daerah) => (
							<option key={daerah.id} value={daerah.id}>
								{daerah.name}
							</option>
						))}
				</select>
			</div>
		);
	}
}

Place.propTypes = {
	children: PropTypes.node.isRequired,
	option: PropTypes.string.isRequired,
	content: PropTypes.array,
	handleSelect: PropTypes.func,
};

export default App;
