namespace Darna.DTOs;

public record CreatePayDto(
    int     PropertyId,
    int     Nights,
    decimal Amount
);