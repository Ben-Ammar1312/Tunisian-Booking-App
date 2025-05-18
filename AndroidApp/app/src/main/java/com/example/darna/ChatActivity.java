package com.example.darna;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.ImageButton;

import com.android.volley.Request;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import org.json.JSONObject;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.darna.adapter.ChatAdapter;
import com.example.darna.dto.ChatMessage;

import org.json.JSONException;

import java.util.HashMap;
import java.util.Map;

public class ChatActivity extends AppCompatActivity {

    private ChatAdapter adapter;
    private EditText et;

    @Override protected void onCreate(Bundle b){
        super.onCreate(b);
        setContentView(R.layout.activity_chat);

        adapter = new ChatAdapter();
        RecyclerView rv = findViewById(R.id.rv_chat);
        rv.setAdapter(adapter);
        rv.setLayoutManager(new LinearLayoutManager(this));

        et = findViewById(R.id.et_msg);
        ImageButton btnSend = findViewById(R.id.btn_send);
        btnSend.setOnClickListener(v -> {
            send();
        });
    }

    private void send(){
        String msg = et.getText().toString().trim();
        if(msg.isEmpty()) return;
        et.setText("");

        adapter.add(new ChatMessage(ChatMessage.Role.USER, msg));

        String url = getString(R.string.api_base_url)+"/chat";
        JSONObject body = new JSONObject();
        try{ body.put("userInput", msg).put("topK", 5); }catch(JSONException ignore){}

        JsonObjectRequest req = new JsonObjectRequest(Request.Method.POST, url, body,
                res -> {
                    String reply = res.optString("reply", "…");
                    adapter.add(new ChatMessage(ChatMessage.Role.BOT, reply));
                },
                err -> adapter.add(new ChatMessage(ChatMessage.Role.BOT,
                        "Désolé, je n’ai pas compris…"))
        ) {
            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> headers = new HashMap<>();
                String token = getJwtToken();
                if (token != null) headers.put("Authorization", "Bearer " + token);
                return headers;
            }
        };
        VolleySingleton.get(this).addToRequestQueue(req);
    }
    private String getJwtToken() {
        return getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
                .getString("token", null);
    }
}