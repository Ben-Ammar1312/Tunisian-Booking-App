package com.example.darna;

import android.os.Bundle;
import android.widget.EditText;
import android.widget.Button;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.toolbox.JsonObjectRequest;

import org.json.JSONArray;
import org.json.JSONObject;

public class AjoutAnnonceActivity extends AppCompatActivity {

    private EditText etName, etLocation, etDescription, etPrice, etImageUrl;
    private Button btnSubmit;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ajout_annonce);

        etName = findViewById(R.id.etName);
        etLocation = findViewById(R.id.etLocation);
        etDescription = findViewById(R.id.etDescription);
        etPrice = findViewById(R.id.etPrice);
        etImageUrl = findViewById(R.id.etImageUrl);
        btnSubmit = findViewById(R.id.btnSubmit);

        btnSubmit.setOnClickListener(v -> ajouterAnnonce());
    }

    private void ajouterAnnonce() {
        String name = etName.getText().toString().trim();
        String location = etLocation.getText().toString().trim();
        String description = etDescription.getText().toString().trim();
        String price = etPrice.getText().toString().trim();
        String imageUrl = etImageUrl.getText().toString().trim();

        if (name.isEmpty() || location.isEmpty() || description.isEmpty() || price.isEmpty()) {
            Toast.makeText(this, "Veuillez remplir tous les champs", Toast.LENGTH_SHORT).show();
            return;
        }

        try {
            JSONObject body = new JSONObject();
            body.put("name", name);
            body.put("location", location);
            body.put("description", description);
            body.put("pricePerNight", Double.parseDouble(price));
            body.put("type", "Maison");
            body.put("isAvailable", true);
            body.put("proprietaireId", 1); // À adapter dynamiquement plus tard

            JSONArray images = new JSONArray();
            if (!imageUrl.isEmpty()) {
                images.put(imageUrl);
            }
            body.put("images", images);

            // Ajoute d'autres champs booléens si besoin

            String url = getString(R.string.api_base_url) + "/property";
            JsonObjectRequest req = new JsonObjectRequest(
                    Request.Method.POST, url, body,
                    response -> {
                        Toast.makeText(this, "Annonce ajoutée avec succès !", Toast.LENGTH_LONG).show();
                        finish();
                    },
                    error -> {
                        Toast.makeText(this, "Erreur: " + error.getMessage(), Toast.LENGTH_LONG).show();
                        error.printStackTrace();
                    }
            );

            VolleySingleton.getInstance(this).addToRequestQueue(req);

        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(this, "Erreur de préparation des données", Toast.LENGTH_LONG).show();
        }
    }
}
