import React from "react";
import { Row, Divider, notification } from "antd";
import { Bar } from "ant-design-pro/lib/Charts";
import DetailCard from "./../../components/DetailCard/DetailCard";
import ResponsiveColumn from "./../../components/ResponsiveColumn";
import TableComp from "./../../components/Table";
import Button from "../../components/Button/Button";
import "./style.css";
import { TeamOutlined } from "@ant-design/icons";
import ModalPopUp from "../../components/ModalPopUp/ModalPopUp";
import { GraphQLClient, gql } from "graphql-request";
import { useAuth0 } from "@auth0/auth0-react";

// Main endpoint to query GraphQL
const endpoint = "/graphql";

// Adding mutation to create new participant
const mutation = gql`
	mutation CreateParticipant($input: InputParticipant!) {
		createParticipant(input: $input) {
			id
		}
	}
`;

// Notification for when participant is entered successfully
const showSuccess = () => {
	notification.success({
		message: "Participant Added",
		description: "Participant successfully added.",
	});
};

// Notification for when participant is not created
const showError = ({ error }) => {
	notification.error({
		message: "Error",
		description: "We couldn't add your participant due to error: " + error,
	});
};

const getParticipantsInfo = () => {
	return [];
};

const getColumns = () => {
	const columns = [
		{
			title: "Participant Guest",
			dataIndex: "participant",
			key: "participant",
			align: "center",
		},
		{
			title: "Guest Email",
			dataIndex: "guestEmail",
			key: "guestEmail",
			responsive: ["md"],
			align: "center",
		},
		{
			title: "Secret Santa",
			dataIndex: "secretSanta",
			key: "secretSanta",
			responsive: ["lg"],
			align: "center",
		},
		{
			title: "Secret Santa Email",
			dataIndex: "secretEmail",
			key: "secretEmail",
			responsive: ["lg"],
			align: "center",
		},
	];

	return columns;
};

const EventCard = () => {
	return (
		<DetailCard
			title="Event details"
			date="date"
			startTime="9:00am"
			location="park"
			actions={[
				<span>
					<Button
						icon={<TeamOutlined style={{ fontSize: "18px" }} />}
						text={" Make Assignments"}
					/>
				</span>,
			]}
		/>
	);
};

const getRsvpData = () => {
	const dataRSVPs = [];
	dataRSVPs.push({ x: "Accepted", y: 45 });
	dataRSVPs.push({ x: "Rejected", y: 10 });
	dataRSVPs.push({ x: "Pending", y: 10 });
	return dataRSVPs;
};

const ChartTitle = () => {
	return (
		<span
			style={{
				color: "#2c6e49",
				fontFamily: "cursive",
				textAlign: "center",
				fontWeight: "bold",
				fontSize: "30px",
			}}
		>
			Track RSVP
		</span>
	);
};

const OrganizerEvent = (props) => {
	const { user, getAccessTokenSilently } = useAuth0();

	// Function to create participant
	const createParticipant = async (first_name, last_name, email) => {
		// Creating input variable
		var variables = {
			input: {
				first_name: first_name,
				last_name: last_name,
				email: email,
				EventId: parseInt(props.match.params.id),
			},
		};
		console.log(props.match.params.id);
		// Added graphQLClient
		const client = (token) =>
			new GraphQLClient(endpoint, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

		const token = await getAccessTokenSilently();
		return client(token)
			.request(mutation, variables)
			.then((event) => {
				showSuccess();
			})
			.catch((error) => {
				showError(error);
			});
	};

	return (
		<>
			<Row gutter={[30, 30]} style={{ padding: 20 }}>
				<ResponsiveColumn lg={6}>
					<EventCard />
				</ResponsiveColumn>
				<ResponsiveColumn lg={18}>
					<Bar
						height="300"
						title={<ChartTitle />}
						data={getRsvpData()}
						color="#d62828"
					/>
					<Divider />
					<TableComp
						dataSource={getParticipantsInfo()}
						columns={getColumns(true)}
					/>
					<Divider />
					<div className="center">
						<ModalPopUp handleLogic={createParticipant} />
					</div>
				</ResponsiveColumn>
			</Row>
		</>
	);
};

export default OrganizerEvent;
