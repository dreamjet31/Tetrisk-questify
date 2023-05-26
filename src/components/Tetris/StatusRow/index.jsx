import React from "react";
import styled from "styled-components";

const Container = styled.div`
	background-color: white;
	transition: background-color 0.5s;
	${props => !props.portrait && `width: 100%;`}
	font-family: 'BungeeSpice-Regular';
`;

// border: ${props => (props.borderSize ? props.borderSize : "3")}px solid white;
// padding: ${props => (props.padding ? props.padding : "15")}px
// 		${props => (props.portrait ? props.padding / 2 : 0)}px; /*15*/

const Title = styled.div`
	width: 100%;
	text-align: center;
	color: black;
	font-family: 'IBMPlexMono-Regular';
	font-size: medium;
	font-weight: bold;
	text-transform: uppercase;
	@media only screen and (max-height: 600px) {
		font-size: 14px;
	}
	@media only screen and (max-height: 420px) {
		font-size: 12px;
	}
`;

const Value = styled.div`
	width: calc(100%-40px);
	text-align: center;
	color: #6961B8;
	border: 1px solid #6961B8;
	border-radius: 8px;
	background: #EFF1FF;
	font-family: 'BungeeSpice-Regular';
	margin: 4px 20px 0px 20px;

`;

const StatusRow = ({
	title,
	value,
	padding,
	margin,
	borderSize,
	portrait,
	backgroundColor
}) => (
	<Container
		portrait={portrait}
		padding={padding}
		margin={margin}
		borderSize={borderSize}
		backgroundColor={backgroundColor}

	>
		<Title>{title}</Title>
		<Value>{value}</Value>
	</Container>
);

export default StatusRow;
