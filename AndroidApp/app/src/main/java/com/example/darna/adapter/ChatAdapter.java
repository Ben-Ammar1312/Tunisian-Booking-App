package com.example.darna.adapter;


import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.darna.R;
import com.example.darna.dto.ChatMessage;

import java.util.ArrayList;
import java.util.List;

public class ChatAdapter extends RecyclerView.Adapter<ChatAdapter.VH>{
    private final List<ChatMessage> data = new ArrayList<>();
    static class VH extends RecyclerView.ViewHolder{
        TextView tv;
        VH(View v){
            super(v);
            tv=v.findViewById(R.id.tv);
        }
    }
    @Override public int getItemViewType(int position){
        return data.get(position).role == ChatMessage.Role.USER ? 1 : 0;
    }

    @Override public @NonNull VH onCreateViewHolder(@NonNull ViewGroup p, int vt){
        int layout = vt == 1 ? R.layout.item_user : R.layout.item_bot;
        return new VH(LayoutInflater.from(p.getContext()).inflate(layout, p, false));
    }
    @Override public void onBindViewHolder(@NonNull VH h,int i){
        ChatMessage m=data.get(i);
        h.tv.setText(m.text);
        h.tv.setBackgroundResource(m.role==ChatMessage.Role.USER?
                R.drawable.bg_user : R.drawable.bg_bot);

    }
    @Override public int getItemCount(){ return data.size(); }
    public void add(ChatMessage m){ data.add(m); notifyItemInserted(data.size()-1); }
}