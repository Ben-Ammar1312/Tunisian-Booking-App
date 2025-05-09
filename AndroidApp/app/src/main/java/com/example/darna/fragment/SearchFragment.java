package com.example.darna.fragment;

import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.darna.HomeActivity;
import com.example.darna.VolleySingleton;
import com.android.volley.Request;
import com.android.volley.toolbox.JsonArrayRequest;
import com.example.darna.R;
import com.example.darna.adapter.PropertyAdapter;
import com.example.darna.model.Property;
import com.google.gson.reflect.TypeToken;
import com.google.gson.Gson;

import java.util.List;

public class SearchFragment extends Fragment implements PropertyAdapter.Listener {

    private EditText etQuery;
    private PropertyAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(
            @NonNull LayoutInflater inf, @Nullable ViewGroup c, @Nullable Bundle s) {
        return inf.inflate(R.layout.fragment_search, c, false);
    }

    @Override public void onViewCreated(@NonNull View v, @Nullable Bundle s) {
        etQuery   = v.findViewById(R.id.et_query);
        RecyclerView rv = v.findViewById(R.id.rv_results);

        adapter = new PropertyAdapter(this);
        rv.setLayoutManager(new GridLayoutManager(getContext(), 2));
        rv.setAdapter(adapter);

        etQuery.setOnEditorActionListener((t, id, ev) -> {
            submitSearch(t.getText().toString().trim());
            return true;
        });
    }

    private void submitSearch(String q) {
        if (q.isEmpty()) return;

        String url = getString(R.string.api_base_url) + "/search"
                + "?query=" + Uri.encode(q) + "&topK=5";

        JsonArrayRequest req = new JsonArrayRequest(
                Request.Method.GET, url, null,
                arr -> {
                    List<Property> list = new Gson()
                            .fromJson(arr.toString(),
                                    new TypeToken<List<Property>>(){}.getType());
                    adapter.submitList(list);
                },
                err -> Toast.makeText(getContext(),
                        "Erreur recherche", Toast.LENGTH_SHORT).show());

        VolleySingleton.getInstance(requireContext()).addToRequestQueue(req);
    }
    @Override public void onClick(Property p){
        // e.g. open details
        ((HomeActivity)requireActivity()).openDetails(p);
    }
}