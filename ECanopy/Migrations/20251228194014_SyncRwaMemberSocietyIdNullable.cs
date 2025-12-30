using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECanopy.Migrations
{
    /// <inheritdoc />
    public partial class SyncRwaMemberSocietyIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RwaMembers_Societies_SocietyId",
                table: "RwaMembers");

            migrationBuilder.AlterColumn<int>(
                name: "SocietyId",
                table: "RwaMembers",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_RwaMembers_Societies_SocietyId",
                table: "RwaMembers",
                column: "SocietyId",
                principalTable: "Societies",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RwaMembers_Societies_SocietyId",
                table: "RwaMembers");

            migrationBuilder.AlterColumn<int>(
                name: "SocietyId",
                table: "RwaMembers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_RwaMembers_Societies_SocietyId",
                table: "RwaMembers",
                column: "SocietyId",
                principalTable: "Societies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
