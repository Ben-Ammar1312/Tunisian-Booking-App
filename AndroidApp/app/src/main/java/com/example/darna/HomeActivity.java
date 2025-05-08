// com/example/darna/HomeActivity.java
package com.example.darna;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.toolbox.JsonArrayRequest;
import com.example.darna.adapter.PropertyAdapter;
import com.example.darna.model.Property;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class HomeActivity extends AppCompatActivity {

    private RecyclerView rv;
    private PropertyAdapter adapter;
    private List<Property> list = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        rv = findViewById(R.id.recyclerViewProperties);
        rv.setLayoutManager(new LinearLayoutManager(this));

        adapter = new PropertyAdapter(list, p -> {
            // on-click → open details
            Intent i = new Intent(this, PropertyDetailsActivity.class);
            i.putExtra("propertyId", p.id);
            startActivity(i);
        });
        rv.setAdapter(adapter);

        fetchProperties();
    }

    private void fetchProperties() {
        String url = getString(R.string.api_base_url) + "/property";
        JsonArrayRequest req = new JsonArrayRequest(
                url,
                this::onResponse,
                this::onError
        );
        req.setRetryPolicy(new DefaultRetryPolicy(15_000,1,1f));
        VolleySingleton.getInstance(this)
                .getRequestQueue()
                .add(req);
    }

    private void onResponse(JSONArray arr) {
        list.clear();
        for (int i = 0; i < arr.length(); i++) {
            JSONObject o = arr.optJSONObject(i);
            if (o == null) continue;
            try {
                Property p = new Property();
                p.id            = o.getInt("id");
                p.name          = o.getString("name");
                p.location      = o.getString("location");
                p.pricePerNight = o.getDouble("pricePerNight");
                p.firstImage    = o.optString("firstImage", null);
                list.add(p);
            } catch (Exception ex) {
                Log.e("HOME_FETCH", "parse error", ex);
            }
        }
        adapter.notifyDataSetChanged();
    }

    private void onError(Throwable t) {
        Log.e("HOME_FETCH", t.toString());
    }
}