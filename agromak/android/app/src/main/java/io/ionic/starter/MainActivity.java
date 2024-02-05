package io.ionic.starter;

import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(GoogleAuth.class);

    super.onCreate(savedInstanceState);
  }
}
