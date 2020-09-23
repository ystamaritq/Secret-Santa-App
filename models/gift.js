// Storing the gift DB model
var Sequelize = require("sequelize");
var { StringColumn, DecimalColumn, DefineTable } = require("./../utils");

// Columns for table
const giftDescriptionColumn = StringColumn(
	"Please enter a brief gift description"
);

const giftLinkColumn = StringColumn("Please paste online link to gift");

const giftPriceColumn = DecimalColumn(
	"Please enter gift price - must be a number"
);

// Establish gift table content and other table relationships
module.exports = function (sequelize) {
	// Creates the table
	var Gift = DefineTable(sequelize, "Gift", {
		description: giftDescriptionColumn,
		link: giftLinkColumn,
		price: giftPriceColumn,
	});

	return Gift;
};
