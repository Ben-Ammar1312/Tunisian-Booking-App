package com.example.darna;

import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.viewpager2.widget.ViewPager2;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.darna.adapter.ImagePagerAdapter;
import com.example.darna.adapter.PropertyAdapter;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PropertyDetailsActivity extends AppCompatActivity {

    private ViewPager2 viewPager;
    private TextView tvName, tvLocation, tvDescription, tvPrice;

    public PropertyAdapter adp;

    @Override protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_property_details);

        viewPager     = findViewById(R.id.viewPagerImages);
        tvName        = findViewById(R.id.tvName);
        tvLocation    = findViewById(R.id.tvLocation);
        tvDescription = findViewById(R.id.tvDescription);
        tvPrice       = findViewById(R.id.tvPrice);

        viewPager.setOffscreenPageLimit(2);

        int id = getIntent().getIntExtra("propertyId", -1);
        fetchPropertyDetails(id);

    }

    /* ---------------- network ---------------- */

    private void fetchPropertyDetails(int id) {
        String url = getString(R.string.api_base_url) + "/property/" + id;
        JsonObjectRequest req = new JsonObjectRequest(
                Request.Method.GET, url, null,
                this::onResponse,
                err -> Log.e("DETAILS_ERR", err.toString())
        ) {
            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> headers = new HashMap<>();
                String token = getJwtToken();
                if (token != null) headers.put("Authorization", "Bearer " + token);
                return headers;
            }
        };

        req.setRetryPolicy(new DefaultRetryPolicy(15_000, 1, 1f));
        VolleySingleton.getInstance(this).getRequestQueue().add(req);
    }

    private void onResponse(JSONObject o) {
        try {
            tvName.setText(o.getString("name"));
            tvLocation.setText(o.getString("location"));
            tvDescription.setText(o.getString("description"));
            tvPrice.setText("TND" + o.getDouble("pricePerNight"));

            /* ---------- extract & transform image URLs ---------- */
            List<String> urls = new ArrayList<>();
            JSONArray arr = o.optJSONArray("images");
            if (arr != null) {
                for (int i = 0; i < arr.length(); i++) {
                    String raw = arr.getString(i);
                    // add Cloudinary transformation so every image is 800 × 500 crop
                    urls.add(raw.replace("/upload/", "/upload/w_800,h_500,c_fill/"));
                }
            }

            viewPager.setAdapter(new ImagePagerAdapter(urls));

        } catch (Exception e) {
            Log.e("DETAILS_PARSE", "error", e);
        }
    }

    private String getJwtToken() {
        return getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
                .getString("token", null);
    }
}