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
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lndmobile.Callback;
import lndmobile.Lndmobile;
import lndmobile.RecvStream;
import lndmobile.SendStream;
import lnrpc.Walletunlocker;

import com.google.protobuf.ByteString;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.ProtocolStringList;

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

    private static LndState state = new LndState();

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
        //Populate all available methods found in Lndmobile
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

    @Override
    public String getName() {
        return "ReactNativeLightning";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    @ReactMethod
    public void start(String configContent, String network, final Promise promise) {
        File appDir = getReactApplicationContext().getFilesDir();
        writeToConfig(configContent, appDir);

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
                state.setLndRunning(true, getReactApplicationContext());
                promise.resolve("unlocked");
            }
        }
        class RPCCallback implements Callback {
            @Override
            public void onError(Exception e) {
                Log.i(TAG, "RPC start err: " + e.getMessage());
                Log.d(TAG, "RPC start err: " + e.getMessage());
            }
            @Override
            public void onResponse(byte[] bytes) {
                Log.i(TAG, "RPC ready for requests");
                Log.d(TAG, "RPC ready for requests");
                state.setGrpcReady(true, getReactApplicationContext());
            }
        }

        Runnable startLnd = new Runnable() {
            @Override
            public void run() {
                Lndmobile.start(args, new StartedCallback(), new RPCCallback());
            }
        };
        new Thread(startLnd).start();
    }

    @ReactMethod
    public void genSeed(final Promise promise) {
        Log.i("LndNativeModule", "Generating seed...");

        class SeedCallback implements Callback {
            @Override
            public void onError(Exception e) {
                Log.i(TAG, "Seed err: " + e.getMessage());
                Log.d(TAG, "Seed err: " + e.getMessage());
                promise.reject(e);
            }
            @Override
            public void onResponse(byte[] bytes) {
                Log.i(TAG, "Seed generated successfully");
                Log.d(TAG, "Seed generated successfully");

                try {
                    ProtocolStringList seed = Walletunlocker.GenSeedResponse.parseFrom(bytes).getCipherSeedMnemonicList();

                    //Map seed list into a react native string array
                    WritableArray promiseSeed = Arguments.createArray();
                    for(int i = 0; i < seed.size(); i++){
                        promiseSeed.pushString(seed.get(i));
                    }

                    promise.resolve(promiseSeed);
                } catch (InvalidProtocolBufferException e) {
                    Log.i(TAG, "Failed to pass genSeed response: " + e.getMessage());
                    Log.d(TAG, "Failed to pass genSeed response: " + e.getMessage());
                    promise.reject(e);
                }
            }
        }

        class GenSeedTask implements Runnable {
            byte[] request;
            GenSeedTask(byte[] r) { request = r;}
            public void run() {
                Lndmobile.genSeed(request, new SeedCallback());
            }
        }
        Thread t = new Thread(new GenSeedTask(Walletunlocker.GenSeedRequest.newBuilder().build().toByteArray()));
        t.start();
    }

    @ReactMethod
    public void createWallet(String password, ReadableArray seed, final Promise promise) {
        Log.i("LndNativeModule", "Initializing wallet...");

        class InitializeWalletCallback implements Callback {
            @Override
            public void onError(Exception e) {
                Log.i(TAG, "init err: " + e.getMessage());
                Log.d(TAG, "init err: " + e.getMessage());
                promise.reject(e);
            }
            @Override
            public void onResponse(byte[] bytes) {
                Log.i(TAG, "Wallet successfully initialized");
                Log.d(TAG, "Wallet successfully initialized");
                state.setWalletUnlocked(true, getReactApplicationContext());
                promise.resolve("initialized");
            }
        }

        //Map a react native ReadableArray to java string array
        String[] seedArray = new String[seed.size()];
        for (int i = 0; i < seed.size(); i++) {
            seedArray[i] = seed.getString(i);
        }

        //Build init request
        Walletunlocker.InitWalletRequest.Builder initRequest = Walletunlocker.InitWalletRequest.newBuilder();
        initRequest.setWalletPassword(ByteString.copyFrom(password.getBytes()));
        initRequest.addAllCipherSeedMnemonic(Arrays.asList(seedArray));

        class InitWalletTask implements Runnable {
            byte[] request;
            InitWalletTask(byte[] r) { request = r;}
            public void run() {
                Lndmobile.initWallet(request, new InitializeWalletCallback());
            }
        }
        Thread t = new Thread(new InitWalletTask(initRequest.build().toByteArray()));
        t.start();
    }

    @ReactMethod
    public void unlockWallet(String password, final Promise promise) {
        Log.i("LndNativeModule", "Unlocking wallet...");

        class UnlockWalletCallback implements Callback {
            @Override
            public void onError(Exception e) {
                Log.i(TAG, "Unlock err: " + e.getMessage());
                Log.d(TAG, "Unlock err: " + e.getMessage());
                e.printStackTrace();

                //TODO wallet still unlocked but sometimes returns an error. Error needs some investigation.
                if (e.getMessage().contains("transport is closing")) {
                    promise.resolve("unlocked");
                } else {
                    promise.reject(e);
                }
            }
            @Override
            public void onResponse(byte[] bytes) {
                Log.i(TAG, "Wallet successfully unlocked");
                Log.d(TAG, "Wallet successfully unlocked");
                state.setWalletUnlocked(true, getReactApplicationContext());
                promise.resolve("unlocked");
            }
        }

        //Build unlock request
        Walletunlocker.UnlockWalletRequest.Builder unlockRequest = Walletunlocker.UnlockWalletRequest.newBuilder();
        unlockRequest.setWalletPassword(ByteString.copyFrom(password.getBytes()));

        class UnlockWalletTask implements Runnable {
            byte[] request;
            UnlockWalletTask(byte[] r) { request = r;}
            public void run() {
                Lndmobile.unlockWallet(request, new UnlockWalletCallback());
            }
        }
        Thread t = new Thread(new UnlockWalletTask(unlockRequest.build().toByteArray()));
        t.start();
    }

    @ReactMethod
    public void walletExists(String network, final Promise promise) {
        File directory = new File(getReactApplicationContext().getFilesDir().toString() + "/data/chain/bitcoin/" + network + "/wallet.db");
        boolean exists = directory.exists();
        Log.d(TAG, "Wallet exists: " + exists);
        promise.resolve(exists);
    }

    @ReactMethod
    public void currentState(final Promise promise) {
        promise.resolve(state.formatted());
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
            promise.reject("LndNativeModule", "method not found");
            return;
        }

        byte[] b = Base64.decode(msg, Base64.NO_WRAP);

        try {
            m.invoke(null, b, new NativeCallback(promise));

            //If LND was stopped reset state
            if (method.equals("StopDaemon")) {
                state.setLndRunning(false, getReactApplicationContext());
                state.setGrpcReady(false, getReactApplicationContext());
                state.setWalletUnlocked(false, getReactApplicationContext());
            }
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
}

class LndState {
    private Boolean lndRunning = false;
    private Boolean walletUnlocked = false;
    private Boolean grpcReady = false;

    public void setLndRunning(Boolean lndRunning, ReactApplicationContext context) {
        this.lndRunning = lndRunning;
        updateStateStream(context);
    }

    public void setWalletUnlocked(Boolean walletUnlocked, ReactApplicationContext context) {
        this.walletUnlocked = walletUnlocked;
        updateStateStream(context);
    }

    public void setGrpcReady(Boolean grpcReady, ReactApplicationContext context) {
        this.grpcReady = grpcReady;
        updateStateStream(context);
    }

    WritableMap formatted() {
        WritableMap params = Arguments.createMap();
        params.putBoolean("lndRunning", lndRunning);
        params.putBoolean("walletUnlocked", walletUnlocked);
        params.putBoolean("grpcReady", grpcReady);
        return params;
    }

    private void updateStateStream(ReactApplicationContext context) {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("lndStateUpdate", formatted());
    }
}
