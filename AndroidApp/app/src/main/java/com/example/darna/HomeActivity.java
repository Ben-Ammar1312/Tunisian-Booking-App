package com.example.darna;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.example.darna.adapter.PropertyAdapter;
import com.example.darna.fragment.SearchFragment;
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

        // on-click → open details
        // Now calling openDetails from the PropertyAdapter onClick
        // In onCreate:
        adapter = new PropertyAdapter(this::openDetails);
        rv.setAdapter(adapter);


        rv.setAdapter(adapter);

        fetchProperties();

        try {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.container, new SearchFragment(), SearchFragment.class.getSimpleName())
                    .commit();
        } catch (Exception e) {
            e.printStackTrace(); // Logs the full stack trace to Logcat
            Log.e("FragmentError", "Error committing fragment transaction: " + e.getMessage());
            Toast.makeText(this, "Fragment error: " + e.getMessage(), Toast.LENGTH_LONG).show(); // Optional: shows a toast
        }
    }

    private void fetchProperties() {
        String url = getString(R.string.api_base_url) + "/property";
        JsonArrayRequest req = new JsonArrayRequest(
                url,
                this::onResponse,
                this::onError
        );
        req.setRetryPolicy(new DefaultRetryPolicy(15_000, 1, 1f));
        VolleySingleton.getInstance(this)
                .getRequestQueue()
                .add(req);
    }

    private void onResponse(JSONArray arr) {
        List<Property> fullList = new ArrayList<>();
        for (int i = 0; i < arr.length(); i++) {
            JSONObject o = arr.optJSONObject(i);
            if (o == null) continue;
            try {
                Property p = new Property();
                p.id = o.getInt("id");
                p.name = o.getString("name");
                p.location = o.getString("location");
                p.pricePerNight = o.getDouble("pricePerNight");
                p.firstImage = o.optString("firstImage", null);
                fullList.add(p);
            } catch (Exception ex) {
                Log.e("HOME_FETCH", "parse error", ex);
            }
        }
        adapter.submitList(fullList);

        // Log the size of the list
        Log.d("HOME_FETCH", "Number of properties fetched: " + fullList.size());

        // Send fullList to the SearchFragment via a Bundle
        if (!fullList.isEmpty()) {
            SearchFragment searchFragment = (SearchFragment) getSupportFragmentManager()
                    .findFragmentByTag(SearchFragment.class.getSimpleName());
            if (searchFragment == null) {
                searchFragment = new SearchFragment();
            }

            Bundle bundle = new Bundle();
            bundle.putSerializable("fullList", (ArrayList<Property>) fullList);
            searchFragment.setArguments(bundle);

            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.container, searchFragment, SearchFragment.class.getSimpleName())
                    .commit();

            // Directly update the SearchFragment adapter
            searchFragment.updateAdapter(fullList);
        } else {
            Log.e("HOME_FETCH", "Property list is empty or null");
        }
    }

    private void onError(VolleyError error) {
        Log.e("HOME_FETCH", "Error fetching properties", error);
    }

    // New method to open details for a property
    public void openDetails(Property p) {
        Intent i = new Intent(this, PropertyDetailsActivity.class);
        i.putExtra("propertyId", p.id);
        startActivity(i);
    }
}





