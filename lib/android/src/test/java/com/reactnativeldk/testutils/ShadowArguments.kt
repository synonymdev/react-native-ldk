package com.reactnativeldk.testutils

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.JavaOnlyArray
import com.facebook.react.bridge.JavaOnlyMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import org.robolectric.annotation.Implementation
import org.robolectric.annotation.Implements

@Implements(Arguments::class)
class ShadowArguments {
    companion object {
        @JvmStatic @Implementation fun createMap(): WritableMap = JavaOnlyMap()
        @JvmStatic @Implementation fun createArray(): WritableArray = JavaOnlyArray()
    }
}
