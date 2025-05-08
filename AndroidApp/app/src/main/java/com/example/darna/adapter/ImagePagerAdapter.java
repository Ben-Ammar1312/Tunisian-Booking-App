package com.example.darna.adapter;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.darna.R;
import com.squareup.picasso.Picasso;

import java.util.List;

public class ImagePagerAdapter
        extends RecyclerView.Adapter<ImagePagerAdapter.VH> {

    private final List<String> urls;

    public ImagePagerAdapter(List<String> urls) { this.urls = urls; }

    @NonNull @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_image_page, parent, false);
        return new VH(v);
    }

    @Override
    public void onBindViewHolder(@NonNull VH h, int position) {
        String url = urls.get(position);
        Log.d("IMG_DEBUG", url);

        Picasso.get()
                .load(url)
                .placeholder(R.drawable.ic_placeholder)
                .error(R.drawable.ic_broken_image)   // create once exactly like placeholder
                .fit()                               // scales to ImageView bounds
                .centerCrop()
                .into(h.image);
    }

    @Override public int getItemCount() { return urls.size(); }

    /* ---------- view-holder ---------- */
    static final class VH extends RecyclerView.ViewHolder {
        final ImageView image;
        VH(View item) {
            super(item);
            image = item.findViewById(R.id.pageImage);
        }
    }
}