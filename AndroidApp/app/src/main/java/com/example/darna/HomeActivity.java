package com.example.darna;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

import android.view.View;
import android.widget.TextView;


import com.example.darna.R;

public class HomeActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        TextView textView = new TextView(this);
        textView.setText("You Are Logged In");
        textView.setTextSize(24);
        textView.setGravity(View.TEXT_ALIGNMENT_CENTER);

        setContentView(textView); // Display the text centered on the screen
    }
}
