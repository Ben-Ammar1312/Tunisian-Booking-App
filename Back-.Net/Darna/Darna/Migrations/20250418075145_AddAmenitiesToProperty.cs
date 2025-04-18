using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Darna.Migrations
{
    /// <inheritdoc />
    public partial class AddAmenitiesToProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AirConditioning",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "BbqGrill",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CarbonMonoxideAlarm",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CoffeeMaker",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Dryer",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "FirstAidKit",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "FreeParkingOnPremises",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Gym",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HairDryer",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Heating",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HotTub",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Kitchen",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PetsAllowed",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Pool",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SmokeAlarm",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Washer",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Wifi",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AirConditioning",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "BbqGrill",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "CarbonMonoxideAlarm",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "CoffeeMaker",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Dryer",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "FirstAidKit",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "FreeParkingOnPremises",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Gym",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "HairDryer",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Heating",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "HotTub",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Kitchen",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "PetsAllowed",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Pool",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "SmokeAlarm",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Washer",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Wifi",
                table: "Properties");
        }
    }
}
