namespace Darna.DTOs;

public record CreatePayDto(
    int     PropertyId,
    int     ClientId,
    int     Nights,
    decimal Amount
);