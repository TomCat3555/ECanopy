using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECanopy.Migrations
{
    /// <inheritdoc />
    public partial class AddedOwner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Societies");

            migrationBuilder.AddColumn<string>(
                name: "Address_City",
                table: "Societies",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Address_PinCode",
                table: "Societies",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Address_State",
                table: "Societies",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Address_Street",
                table: "Societies",
                type: "varchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OwnershipRequests",
                columns: table => new
                {
                    OwnershipRequestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ResidentId = table.Column<int>(type: "int", nullable: false),
                    FlatId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RequestedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ReviewedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OwnershipRequests", x => x.OwnershipRequestId);
                    table.ForeignKey(
                        name: "FK_OwnershipRequests_Flats_FlatId",
                        column: x => x.FlatId,
                        principalTable: "Flats",
                        principalColumn: "FlatId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OwnershipRequests_Residents_ResidentId",
                        column: x => x.ResidentId,
                        principalTable: "Residents",
                        principalColumn: "ResidentId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_OwnershipRequests_FlatId",
                table: "OwnershipRequests",
                column: "FlatId");

            migrationBuilder.CreateIndex(
                name: "IX_OwnershipRequests_ResidentId",
                table: "OwnershipRequests",
                column: "ResidentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OwnershipRequests");

            migrationBuilder.DropColumn(
                name: "Address_City",
                table: "Societies");

            migrationBuilder.DropColumn(
                name: "Address_PinCode",
                table: "Societies");

            migrationBuilder.DropColumn(
                name: "Address_State",
                table: "Societies");

            migrationBuilder.DropColumn(
                name: "Address_Street",
                table: "Societies");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Societies",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
