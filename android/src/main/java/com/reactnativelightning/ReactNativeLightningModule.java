package com.reactnativelightning;

import android.os.FileObserver;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lndmobile.Callback;
import lndmobile.Lndmobile;
import lndmobile.RecvStream;
import lndmobile.SendStream;

public class ReactNativeLightningModule extends ReactContextBaseJavaModule {

    private static final String streamEventName = "streamEvent";
    private static final String streamIdKey = "streamId";
    private static final String respB64DataKey = "data";
    private static final String respErrorKey = "error";
    private static final String respEventTypeKey = "event";
    private static final String respEventTypeData = "data";
    private static final String respEventTypeError = "error";
    private static final String logEventName = "logs";
    private static final String TAG = "lnd";

    private Map<String, SendStream> activeStreams = new HashMap<>();
    private Map<String, Method> syncMethods = new HashMap<>();
    private Map<String, Method> streamMethods = new HashMap<>();

    private FileObserver logObserver;

    public ReactNativeLightningModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private static boolean isReceiveStream(Method m) {
        return m.toString().contains("RecvStream");
    }

    private static boolean isSendStream(Method m) {
        return m.toString().contains("SendStream");
    }

    private static boolean isStream(Method m) {
        return isReceiveStream(m) || isSendStream(m);
    }

    public void LndNativeModule(ReactApplicationContext reactContext) {
        setAvailableMethods();
    }

    @Override
    public String getName() {
        return "ReactNativeLightning";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    //Populate all available methods found in Lndmobile
    private void setAvailableMethods() {
        Method[] methods = Lndmobile.class.getDeclaredMethods();

        for (Method m : methods) {
            String name = m.getName();
            name = name.substring(0, 1).toUpperCase() + name.substring(1);
            if (isStream(m)) {
                streamMethods.put(name, m);
            } else {
                syncMethods.put(name, m);
            }
        }
    }

    @ReactMethod
    public void start(String configContent, String network, final Promise promise) {
        String appDir = getReactApplicationContext().getFilesDir().toString().concat("/lnd");

        File appFile = new File(appDir);
        if (!appFile.exists()){
            appFile.mkdirs();
        }

        writeToConfig(configContent, new File(appDir));

        final String logDir = appDir + "/logs/bitcoin/" + network;
        final String logFile = logDir + "/lnd.log";

        FileInputStream stream = null;
        while (true) {
            try {
                stream = new FileInputStream(logFile);
            } catch (FileNotFoundException e) {
                File dir = new File(logDir);
                dir.mkdirs();
                File f = new File(logFile);
                try {
                    f.createNewFile();
                    continue;
                } catch (IOException e1) {
                    e1.printStackTrace();
                    return;
                }
            }
            break;
        }

        final InputStreamReader istream = new InputStreamReader(stream);
        final BufferedReader buf = new BufferedReader(istream);
        try {
            readToEnd(buf, false);
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        logObserver = new FileObserver(logFile) {
            @Override
            public void onEvent(int event, String file) {
                if(event != FileObserver.MODIFY) {
                    return;
                }
                try {
                    readToEnd(buf, true);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        };
        logObserver.startWatching();
        Log.i("LndNativeModule", "Started watching " + logFile);

        final String args = "--lnddir=" + appDir;
        Log.i("LndNativeModule", "Starting LND with args " + args);

        class StartedCallback implements Callback {
            @Override
            public void onError(Exception e) {
                Log.i(TAG, "Wallet unlock err: " + e.getMessage());
                Log.d(TAG, "Wallet unlock err: " + e.getMessage());
                promise.reject(e);
            }
            @Override
            public void onResponse(byte[] bytes) {
                Log.i(TAG, "Wallet ready to be unlocked");
                Log.d(TAG, "Wallet ready to be unlocked");
                promise.resolve("LND started");
            }
        }

        Runnable startLnd = new Runnable() {
            @Override
            public void run() {
                Lndmobile.start(args, new StartedCallback());
            }
        };
        new Thread(startLnd).start();
    }

    @ReactMethod
    public void walletExists(String network, final Promise promise) {
        File directory = new File(getReactApplicationContext().getFilesDir().toString() + "/lnd/data/chain/bitcoin/" + network + "/wallet.db");
        boolean exists = directory.exists();
        Log.d(TAG, "Wallet exists: " + exists);
        promise.resolve(exists);
    }

    @ReactMethod
    public void logFileContent(String network, Integer limit, final Promise promise) {
        File appDir = getReactApplicationContext().getFilesDir();
        final String logDir = appDir + "/logs/bitcoin/" + network;
        final String logFile = logDir + "/lnd.log";

        try (FileReader file = new FileReader(logFile)) {
            List<String> logLines = new ArrayList<>();

            StringBuffer sb = new StringBuffer();
            while (file.ready()) {
                char c = (char) file.read();
                if (c == '\n') {
                    logLines.add(sb.toString() + "\n");
                    sb = new StringBuffer();
                } else {
                    sb.append(c);
                }
            }
            if (sb.length() > 0) {
                logLines.add(sb.toString() + "\n");
            }

            Integer lastIndex = logLines.size() - 1;
            Integer startIndex = lastIndex - limit;
            if (startIndex < 0) {
                startIndex = 0;
            }

            WritableArray trimmedLines = Arguments.createArray();

            if (startIndex != 0) {
                trimmedLines.pushString("---Trimmed " + startIndex + " lines above---\n");
            }

            for(String line : logLines.subList(startIndex, lastIndex)) {
                trimmedLines.pushString(line);
            }

            promise.resolve(trimmedLines);
        } catch (IOException e) {
            promise.reject(e);
        }
    }

    private void readToEnd(BufferedReader buf, boolean emit) throws IOException {
        String s = "";
        while ( (s = buf.readLine()) != null ) {
            if (!emit) {
                continue;
            }
            getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(logEventName, s);
        }
    }

    private void writeToConfig(String configContent, File appDir) {
        File conf = new File(appDir, "lnd.conf");
        if (conf.exists()) {
            conf.delete();
        }

        try (BufferedWriter out = new BufferedWriter(new FileWriter(appDir.getPath() + "/lnd.conf"))) {
            out.write(configContent);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void sendCommand(String method, String msg, final Promise promise) {
        class NativeCallback implements Callback {
            Promise promise;

            NativeCallback(Promise promise) {
                this.promise = promise;
            }

            @Override
            public void onError(Exception e) {
                promise.reject("LndNativeModule", e);
            }

            @Override
            public void onResponse(byte[] bytes) {
                String b64 = "";
                if (bytes != null && bytes.length > 0) {
                    b64 = Base64.encodeToString(bytes, Base64.NO_WRAP);
                }

                WritableMap params = Arguments.createMap();
                params.putString(respB64DataKey, b64);

                promise.resolve(params);
            }
        }

        Method m = syncMethods.get(method);
        if (m == null) {
            //Not all methods are exposed at time of init. Re-populate the available methods to make sure before rejecting.
            setAvailableMethods();
            m = syncMethods.get(method);
            if (m == null) {
                promise.reject("LndNativeModule",  "'" + method + "' method not found");
                return;
            }
        }

        try {
            m.invoke(null, Base64.decode(msg, Base64.NO_WRAP), new NativeCallback(promise));
        } catch (IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
            promise.reject("LndNativeModule", e);
        }
    }

    @ReactMethod
    public void sendStreamCommand(String method, String streamId, String msg) {
        class ReceiveStream implements RecvStream {
            String streamID;

            ReceiveStream(String id) {
                this.streamID = id;
            }

            @Override
            public void onError(Exception e) {
                WritableMap params = Arguments.createMap();
                params.putString(streamIdKey, streamID);
                params.putString(respEventTypeKey, respEventTypeError);
                params.putString(respErrorKey, e.getLocalizedMessage());
                getReactApplicationContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit(streamEventName, params);
            }

            @Override
            public void onResponse(byte[] bytes) {
                String b64 = "";
                if (bytes != null && bytes.length > 0) {
                    b64 = Base64.encodeToString(bytes, Base64.NO_WRAP);
                }

                WritableMap params = Arguments.createMap();
                params.putString(streamIdKey, streamID);
                params.putString(respEventTypeKey, respEventTypeData);
                params.putString(respB64DataKey, b64);
                getReactApplicationContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit(streamEventName, params);
            }
        }

        Method m = streamMethods.get(method);
        if (m == null) {
            return;
        }
        ReceiveStream r = new ReceiveStream(streamId);

        try {
            if (isSendStream(m)) {
                Object sendStream = m.invoke(null, r);
                this.activeStreams.put(streamId, (SendStream) sendStream);
            } else {
                byte[] b = Base64.decode(msg, Base64.NO_WRAP);
                m.invoke(null, b, r);
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void sendStreamWrite(String streamId, String msg) {
        SendStream stream = activeStreams.get(streamId);
        if (stream == null) {
            return;
        }

        byte[] b = Base64.decode(msg, Base64.NO_WRAP);
        try {
            stream.send(b);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Keep: Required for RN built in Event Emitter Calls.
    }
}
