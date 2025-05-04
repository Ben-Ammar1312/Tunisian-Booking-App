package com.example.darna;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private EditText emailEditText, passwordEditText;
    private Button loginButton,registerButton;
    private RequestQueue requestQueue;  // Volley request queue

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);  // your XML layout

        emailEditText = findViewById(R.id.emailInput);     // make sure these IDs match your XML
        passwordEditText = findViewById(R.id.passwordInput);
        loginButton = findViewById(R.id.loginButton);
        registerButton = findViewById(R.id.registerButton);

        requestQueue = Volley.newRequestQueue(this);  // Initialize Volley

        loginButton.setOnClickListener(v -> {
            loginUser();
        });

        registerButton.setOnClickListener(v -> {
            registerUser();
        });
    }

    private void registerUser() {

        Intent intent = new Intent(MainActivity.this, RegisterActivity.class);
        startActivity(intent);
        finish();
    }

    private void loginUser() {
        String email = emailEditText.getText().toString().trim();
        String password = passwordEditText.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show();
            return;
        }

        String baseUrl = getString(R.string.api_base_url);
        String loginUrl = baseUrl + "/auth/login";
        Log.d("LOGIN_DEBUG", "Login URL: " + loginUrl);

        JSONObject loginData = new JSONObject();
        try {
            loginData.put("email", email);
            loginData.put("password", password);
        } catch (JSONException e) {
            e.printStackTrace();
            Toast.makeText(this, "Failed to create request body", Toast.LENGTH_SHORT).show();
            return;
        }

        Log.d("LOGIN_DEBUG", "Request JSON: " + loginData.toString());

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
                Request.Method.POST,
                loginUrl,
                loginData,
                response -> {
                    Log.d("LOGIN_DEBUG", "Response: " + response.toString());
                    try {
                        String token = response.getString("token");
                        String role = response.getString("role");
                        String fullName = response.getString("fullName");
                        int userId = response.getInt("id");

                        Toast.makeText(this, "Login successful! Welcome " + fullName, Toast.LENGTH_LONG).show();

                        SharedPreferences sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE);
                        SharedPreferences.Editor editor = sharedPreferences.edit();
                        editor.putString("token", token);
                        editor.putString("role", role);
                        editor.putInt("userId", userId);
                        editor.apply();

                        Intent intent = new Intent(MainActivity.this, HomeActivity.class);
                        startActivity(intent);
                        finish();

                    } catch (JSONException e) {
                        e.printStackTrace();
                        Toast.makeText(this, "Response parse error", Toast.LENGTH_SHORT).show();
                    }
                },
                error -> {
                    String errorMsg = "Login failed";
                    if (error.networkResponse != null) {
                        errorMsg += " - HTTP " + error.networkResponse.statusCode;
                        Log.e("LOGIN_DEBUG", "HTTP status: " + error.networkResponse.statusCode);
                        try {
                            String body = new String(error.networkResponse.data, "UTF-8");
                            Log.e("LOGIN_DEBUG", "Error response body: " + body);
                        } catch (Exception e) {
                            Log.e("LOGIN_DEBUG", "Error reading error body", e);
                        }
                    } else {
                        Log.e("LOGIN_DEBUG", "Network error: " + error.toString());
                    }
                    Toast.makeText(this, errorMsg, Toast.LENGTH_SHORT).show();
                }
        ) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<>();
                headers.put("Content-Type", "application/json");
                return headers;
            }
        };

        jsonObjectRequest.setRetryPolicy(new DefaultRetryPolicy(
                10000, // 10 sec timeout
                DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT
        ));
        jsonObjectRequest.setShouldCache(false);

        requestQueue.add(jsonObjectRequest);
    }




}
