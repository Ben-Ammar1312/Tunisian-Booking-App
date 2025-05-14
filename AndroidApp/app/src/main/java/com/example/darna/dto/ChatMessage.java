package com.example.darna.dto;

public class ChatMessage {
    public enum Role { USER, BOT }
    public final Role role;
    public final String text;
    public ChatMessage(Role r, String t){ role=r; text=t; }
}