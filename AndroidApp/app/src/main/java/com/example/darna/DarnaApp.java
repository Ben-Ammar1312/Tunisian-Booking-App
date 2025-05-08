package com.example.darna;

import android.app.Application;
import android.net.Uri;
import android.util.Log;

import com.squareup.picasso.Picasso;
import com.jakewharton.picasso.OkHttp3Downloader;
import java.util.concurrent.TimeUnit;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
public class DarnaApp extends Application {

    @Override public void onCreate() {
        super.onCreate();

        OkHttpClient ok = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30,  TimeUnit.SECONDS)
                .addNetworkInterceptor(new HttpLoggingInterceptor()
                        .setLevel(HttpLoggingInterceptor.Level.BODY))
                .build();

        Picasso picasso = new Picasso.Builder(this)
                .downloader(new OkHttp3Downloader(ok))
                .loggingEnabled(true)                 // <-- you already have this
                .listener((Picasso p, Uri uri, Exception ex) ->
                        Log.e("PICASSO_ERR", "Could not load " + uri, ex))
                .build();
        Picasso.setSingletonInstance(picasso);
    }
}