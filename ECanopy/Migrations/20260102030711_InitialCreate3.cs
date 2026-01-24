using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECanopy.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SocietyDescription",
                table: "Societies",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "Societies",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Notices_SocietyId",
                table: "Notices",
                column: "SocietyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notices_Societies_SocietyId",
                table: "Notices",
                column: "SocietyId",
                principalTable: "Societies",
                principalColumn: "SocietyId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notices_Societies_SocietyId",
                table: "Notices");

            migrationBuilder.DropIndex(
                name: "IX_Notices_SocietyId",
                table: "Notices");

            migrationBuilder.UpdateData(
                table: "Societies",
                keyColumn: "SocietyDescription",
                keyValue: null,
                column: "SocietyDescription",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "SocietyDescription",
                table: "Societies",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Societies",
                keyColumn: "Address",
                keyValue: null,
                column: "Address",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "Societies",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
