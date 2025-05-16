package com.example.darna;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;
import android.view.Menu;
import android.view.MenuItem;
import androidx.appcompat.widget.Toolbar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.example.darna.adapter.PropertyAdapter;
import com.example.darna.fragment.SearchFragment;
import com.example.darna.model.Property;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class HomeActivity extends AppCompatActivity
        implements SearchFragment.SearchListener {

    private final List<Property> list = new ArrayList<>();
    private PropertyAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // 1) RecyclerView
        RecyclerView rv = findViewById(R.id.recyclerViewProperties);
        rv.setLayoutManager(new LinearLayoutManager(this));
        adapter = new PropertyAdapter(this::openDetails);
        rv.setAdapter(adapter);

        // 2) search fragment
        getSupportFragmentManager().beginTransaction()
                .replace(R.id.container, new SearchFragment(), "SEARCH")
                .commit();

        // 3) load the full list
        fetchProperties();
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.action_chat) {
            startActivity(new Intent(this, ChatActivity.class));
            return true;

        } else if (item.getItemId() == R.id.action_add_annonce) {
            startActivity(new Intent(this, AjoutAnnonceActivity.class));
            return true;

        } else if (item.getItemId() == R.id.action_logout) {
            // Cancel all pending fetches
            VolleySingleton.getInstance(this).getRequestQueue().cancelAll("FETCH_TAG");

            // Clear saved user data
            SharedPreferences sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPreferences.edit();
            editor.clear();
            editor.apply();

            Toast.makeText(this, "Déconnecté", Toast.LENGTH_SHORT).show();

            // Redirect to MainActivity
            Intent intent = new Intent(this, MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            finish();
            return true;
        }


        return super.onOptionsItemSelected(item);
    }

    private void fetchProperties() {
        String url = getString(R.string.api_base_url) + "/property";
        JsonArrayRequest req = new JsonArrayRequest(url,
                this::onResponse, this::onError);
        req.setRetryPolicy(new DefaultRetryPolicy(15000,1,1f));
        req.setTag("FETCH_TAG");

        VolleySingleton.getInstance(this)
                .getRequestQueue()
                .add(req);
    }

    private void onResponse(JSONArray arr) {
        list.clear();
        for (int i=0; i<arr.length(); i++) {
            JSONObject o = arr.optJSONObject(i);
            if (o==null) continue;
            Property p = new Property();
            p.id            = o.optInt("id");
            p.name          = o.optString("name");
            p.location      = o.optString("location");
            p.pricePerNight = o.optDouble("pricePerNight");
            p.firstImage    = o.optString("firstImage", null);
            list.add(p);
        }
        adapter.submitList(list);
        Log.d("HOME_FETCH","fetched "+list.size());
    }

    private void onError(VolleyError e) {
        if (!isFinishing()) {
            Log.e("HOME_FETCH", "error", e);
            Toast.makeText(this, "Fetch failed", Toast.LENGTH_SHORT).show();
        }
    }


    @Override  // from SearchFragment
    public void onSearch(String query) {
        if (query.isEmpty()) {
            adapter.submitList(list);
            return;
        }
        String url = getString(R.string.api_base_url)
                + "/Search?query=" + Uri.encode(query)
                + "&topK=10";
        JsonArrayRequest req = new JsonArrayRequest(
                Request.Method.GET, url, null,
                arr -> {
                    List<Property> results = new ArrayList<>();
                    for (int i=0;i<arr.length();i++){
                        JSONObject o = arr.optJSONObject(i);
                        if (o==null) continue;
                        Property p = new Property();
                        p.id            = o.optInt("id");
                        p.name          = o.optString("name");
                        p.location      = o.optString("location");
                        p.pricePerNight = o.optDouble("pricePerNight");
                        p.firstImage    = o.optString("firstImage",null);
                        results.add(p);
                    }
                    adapter.submitList(results);
                },
                err -> {
                    Toast.makeText(this,
                            "Recherche échouée: "+err.getMessage(),
                            Toast.LENGTH_SHORT).show();
                }
        );
        VolleySingleton.getInstance(this)
                .getRequestQueue()
                .add(req);
    }

    private void openDetails(Property p) {
        Intent i = new Intent(this, PropertyDetailsActivity.class);
        i.putExtra("propertyId", p.id);
        startActivity(i);
    }


}


