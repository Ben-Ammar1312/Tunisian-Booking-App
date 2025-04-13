﻿// <auto-generated />
using System;
using Darna.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Darna.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250413130425_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Darna.Models.House", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsAvailable")
                        .HasColumnType("bit");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("nvarchar(150)");

                    b.Property<decimal>("PricePerNight")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("ProprietaireId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ProprietaireId");

                    b.ToTable("Houses");
                });

            modelBuilder.Entity("Darna.Models.Reservation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ClientId")
                        .HasColumnType("int");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("HouseId")
                        .HasColumnType("int");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<decimal>("TotalPrice")
                        .HasColumnType("decimal(18,2)");

                    b.HasKey("Id");

                    b.HasIndex("ClientId");

                    b.HasIndex("HouseId");

                    b.ToTable("Reservations");
                });

            modelBuilder.Entity("Darna.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasMaxLength(13)
                        .HasColumnType("nvarchar(13)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EmailVerificationToken")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("EmailVerified")
                        .HasColumnType("bit");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("VerificationToken")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");

                    b.HasDiscriminator().HasValue("User");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Darna.Models.Client", b =>
                {
                    b.HasBaseType("Darna.Models.User");

                    b.HasDiscriminator().HasValue("Client");
                });

            modelBuilder.Entity("Darna.Models.Proprietaire", b =>
                {
                    b.HasBaseType("Darna.Models.User");

                    b.HasDiscriminator().HasValue("Proprietaire");
                });

            modelBuilder.Entity("Darna.Models.House", b =>
                {
                    b.HasOne("Darna.Models.Proprietaire", "Proprietaire")
                        .WithMany("Houses")
                        .HasForeignKey("ProprietaireId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Proprietaire");
                });

            modelBuilder.Entity("Darna.Models.Reservation", b =>
                {
                    b.HasOne("Darna.Models.Client", "Client")
                        .WithMany("Reservations")
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Darna.Models.House", "House")
                        .WithMany("Reservations")
                        .HasForeignKey("HouseId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Client");

                    b.Navigation("House");
                });

            modelBuilder.Entity("Darna.Models.House", b =>
                {
                    b.Navigation("Reservations");
                });

            modelBuilder.Entity("Darna.Models.Client", b =>
                {
                    b.Navigation("Reservations");
                });

            modelBuilder.Entity("Darna.Models.Proprietaire", b =>
                {
                    b.Navigation("Houses");
                });
#pragma warning restore 612, 618
        }
    }
}
