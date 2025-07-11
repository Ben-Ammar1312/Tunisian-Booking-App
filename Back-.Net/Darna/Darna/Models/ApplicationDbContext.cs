﻿using Microsoft.EntityFrameworkCore;

namespace Darna.Models
{
    public class ApplicationDbContext : DbContext
    {
        // Constructor for runtime (dependency injection)
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Property> Properties { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<User> Users { get; set; }

        public DbSet<PropertyImage> PropertyImages { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Example: Turn OFF cascading deletes from Reservation -> Client
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Client)
                .WithMany(c => c.Reservations)
                .HasForeignKey(r => r.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            // Also turn OFF cascading deletes from Reservation -> House
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Property)
                .WithMany(h => h.Reservations)
                .HasForeignKey(r => r.PropertyId)
                .OnDelete(DeleteBehavior.Restrict);

            // You can keep House -> Proprietaire as cascading if you want, or also make it Restrict
            // modelBuilder.Entity<House>()
            //     .HasOne(h => h.Proprietaire)
            //     .WithMany(p => p.Houses)
            //     .HasForeignKey(h => h.ProprietaireId)
            //     .OnDelete(DeleteBehavior.Restrict);

            // ... also set up your decimal precision, etc.
            modelBuilder.Entity<Property>()
                .Property(h => h.PricePerNight)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Reservation>()
                .Property(r => r.TotalPrice)
                .HasColumnType("decimal(18,2)");
        }
        
    }
}