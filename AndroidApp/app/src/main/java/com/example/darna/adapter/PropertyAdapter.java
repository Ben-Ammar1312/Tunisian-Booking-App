package com.example.darna.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.darna.R;
import com.example.darna.model.Property;

import java.util.ArrayList;
import java.util.List;

public class PropertyAdapter
        extends RecyclerView.Adapter<PropertyAdapter.VH> {

    public interface Listener { void onClick(Property p); }


    private final List<Property> items = new ArrayList<>();
    private final Listener listener;

    public PropertyAdapter( Listener listener) {
        this.listener = listener;
    }

    @Override
    public VH onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_property, parent, false);
        return new VH(v);
    }

    @Override
    public void onBindViewHolder(VH holder, int pos) {
        Property p = items.get(pos);
        holder.tvName.setText(p.name);
        holder.tvLocation.setText(p.location);
        holder.tvPrice.setText("TND" + p.pricePerNight);
        Glide.with(holder.imgFirst.getContext())
                .load(p.firstImage)
                .placeholder(R.drawable.ic_placeholder)
                .error(R.drawable.ic_broken_image)
                .centerCrop()
                .into(holder.imgFirst);

        holder.itemView.setOnClickListener(v -> listener.onClick(p));
    }

    @Override public int getItemCount() { return items.size(); }
    public void submitList(List<Property> list){
        items.clear();
        items.addAll(list);
        notifyDataSetChanged();
    }
    static class VH extends RecyclerView.ViewHolder {
        ImageView imgFirst;
        TextView tvName, tvLocation, tvPrice;
        VH(View itemView) {
            super(itemView);
            imgFirst   = itemView.findViewById(R.id.imgFirst);
            tvName     = itemView.findViewById(R.id.tvName);
            tvLocation = itemView.findViewById(R.id.tvLocation);
            tvPrice    = itemView.findViewById(R.id.tvPrice);
        }
    }
}