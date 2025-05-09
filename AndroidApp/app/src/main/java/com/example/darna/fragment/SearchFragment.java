package com.example.darna.fragment;

import android.net.Uri;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
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

import java.util.ArrayList;
import java.util.List;

public class SearchFragment extends Fragment implements PropertyAdapter.Listener {

    private EditText etQuery;
    private PropertyAdapter adapter;
    private List<Property> fullList = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_search, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View v, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(v, savedInstanceState);

        if (getArguments() != null) {
            fullList = (List<Property>) getArguments().getSerializable("fullList");
        }

        RecyclerView rv = v.findViewById(R.id.rv_results);
        rv.setLayoutManager(new GridLayoutManager(getContext(), 2));
        adapter = new PropertyAdapter(this);
        rv.setAdapter(adapter);

        if (fullList != null) {
            adapter.submitList(fullList);
        }

        etQuery = v.findViewById(R.id.et_query);
        etQuery.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                submitSearch(s.toString().trim());
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void submitSearch(String q) {
        if (q.isEmpty()) {
            adapter.submitList(fullList);
            return;
        }

        List<Property> filtered = new ArrayList<>();
        for (Property p : fullList) {
            if (p.name.toLowerCase().contains(q.toLowerCase()) ||
                    p.location.toLowerCase().contains(q.toLowerCase())) {
                filtered.add(p);
            }
        }

        adapter.submitList(filtered);
    }

    public void updateAdapter(List<Property> newList) {
        fullList = newList;
        adapter.submitList(newList);
    }

    @Override
    public void onClick(Property p) {
        ((HomeActivity) requireActivity()).openDetails(p);
    }
}
