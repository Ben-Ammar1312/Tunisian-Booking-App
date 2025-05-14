// com/example/darna/fragment/SearchFragment.java
package com.example.darna.fragment;

import android.content.Context;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.darna.R;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

public class SearchFragment extends Fragment {
    public interface SearchListener {
        void onSearch(String query);
    }

    private SearchListener listener;
    private TextInputEditText etQuery;
    private MaterialButton btnSearch;

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (!(context instanceof SearchListener)) {
            throw new IllegalStateException("Host must implement SearchListener");
        }
        listener = (SearchListener) context;
    }

    @Nullable @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater,
            @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState
    ) {
        return inflater.inflate(R.layout.fragment_search, container, false);
    }

    @Override
    public void onViewCreated(
            @NonNull View view,
            @Nullable Bundle savedInstanceState
    ) {
        etQuery   = view.findViewById(R.id.et_query);
        btnSearch = view.findViewById(R.id.btn_search);

        btnSearch.setOnClickListener(v -> {
            String q = etQuery.getText().toString().trim();
            // if you want to reset when query empty:
            if (TextUtils.isEmpty(q)) {
                listener.onSearch("");
            } else {
                listener.onSearch(q);
            }
        });
    }
}